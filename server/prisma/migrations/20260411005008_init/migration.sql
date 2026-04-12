-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenant_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cohorts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "routes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "component_registry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slot_type" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "default_props" TEXT,
    "props_schema" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "slot_definitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route_id" TEXT NOT NULL,
    "slot_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allowed_slot_types" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "viewports" TEXT NOT NULL DEFAULT '["desktop","mobile"]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "slot_definitions_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_layouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "viewport" TEXT NOT NULL,
    "layout_json" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "published_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "page_layouts_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "page_layouts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "page_layouts_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_code_key" ON "tenants"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cohorts_tenant_id_code_key" ON "cohorts"("tenant_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "routes_path_key" ON "routes"("path");

-- CreateIndex
CREATE UNIQUE INDEX "component_registry_code_key" ON "component_registry"("code");

-- CreateIndex
CREATE UNIQUE INDEX "slot_definitions_route_id_slot_key_key" ON "slot_definitions"("route_id", "slot_key");

-- CreateIndex
CREATE UNIQUE INDEX "page_layouts_route_id_tenant_id_cohort_id_viewport_status_key" ON "page_layouts"("route_id", "tenant_id", "cohort_id", "viewport", "status");
