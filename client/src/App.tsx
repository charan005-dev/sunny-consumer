import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import Auth0ProviderWithConfig from "./auth/Auth0Provider";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/common/Header";
import DynamicPage from "./pages/DynamicPage";
import PreviewPage from "./pages/PreviewPage";
import PreviewComponentPage from "./pages/PreviewComponentPage";
import PreviewV2Page from "./pages/PreviewV2Page";
import { ThemeProvider } from "./contexts/ThemeContext";
import { setAuthToken } from "./services/api";

const queryClient = new QueryClient();

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function AppContent() {
  const { getAccessTokenSilently, isAuthenticated, logout, user } = useAuth0();
  const [tenantCode, setTenantCode] = useState("kaiser");

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAuthToken(token);
        // Read tenant/cohort from access token claims
        const payload = decodeJwtPayload(token);
        const tc = payload["https://layout-builder.local/tenant_code"] as string;
        if (tc) setTenantCode(tc.toLowerCase());
      }).catch(console.error);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <ThemeProvider tenantCode={tenantCode}>
      <div className="min-h-screen bg-[#f5f5f0]">
        <Header
          tenantName={tenantCode.charAt(0).toUpperCase() + tenantCode.slice(1)}
          email={user?.email}
          onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/rewards" replace />} />
          <Route path="/rewards" element={<DynamicPage />} />
          <Route path="/my-card" element={<DynamicPage />} />
          <Route path="*" element={<DynamicPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Preview routes — no auth required, used by console iframe */}
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/preview/component" element={<PreviewComponentPage />} />
          <Route path="/preview/v2" element={<PreviewV2Page />} />

          {/* All other routes — auth required */}
          <Route
            path="*"
            element={
              <Auth0ProviderWithConfig>
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              </Auth0ProviderWithConfig>
            }
          />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
