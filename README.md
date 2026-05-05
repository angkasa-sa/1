# Mini WMS Take-Home Test

## Domain Knowledge
A warehouse management system helps a company track where goods are stored and how much stock is
available in each location.

- Warehouse: a physical storage location, such as a fulfillment center or branch warehouse.
- Item: a product or material that can be stocked. The SKU is the item's unique code.
- Category: master data used to group items, such as packaging, hardware, or apparel.
- Inventory: the physical stock of an item at a specific warehouse. An item defines what the product
  is, while inventory records where that item exists and how many units are currently there.
- `quantityOnHand`: the current physical quantity available in the warehouse.
- `reorderPoint`: the row-level threshold used to decide whether inventory is low stock.
- Inventory policy: one global setting that decides how low stock should be calculated.
- Dashboard: a read-only summary that helps users see inventory health, especially low-stock and
  out-of-stock situations.

## Starting Point
This repository contains a small warehouse management app:

- Backend: NestJS, TypeORM, Postgres.
- Frontend: React, Vite, TanStack Router.
- UI: shadcn/Radix primitives.
- Existing baseline resources: warehouses and items.

Warehouses and items have simple CRUD behavior already. Several important capabilities are
intentionally missing. Some tests fail at the start; they describe the expected finished behavior.

## What To Build
The goal is to complete this mini warehouse management system (WMS).
Check mini-wms-demo.mp4 for behavior and visual reference.

### 1. Item Categories
Add item category CRUD.

Expected behavior:

- Create, list, update, and delete item categories.
- Category names are required.
- Category names cannot be duplicated.
- Categories used by existing items cannot be deleted.
- Items should use category master data, not free-text category names.

### 2. Inventory
Add inventory CRUD.

Expected behavior:

- Create, list, update, and delete inventory rows.
- Each inventory row belongs to one warehouse and one item.
- The same item cannot be duplicated in the same warehouse.
- `quantityOnHand` must be zero or greater.
- `reorderPoint` must be zero or greater.
- Inventory list rows should include useful display fields such as warehouse code/name, item SKU/name,
  and category name.
- Inventory status must be derived by the backend, not stored as an editable column.

### 3. Inventory Policy
Add one global inventory policy.
The policy shape is:

- `lowStockMode`: `reorder_point | low_stock_threshold`
- `lowStockThreshold`: number

Expected behavior:

- The app always works with exactly one policy.
- The policy can be read and updated.
- Updating the policy changes derived inventory statuses.

Inventory status rules:

- `quantityOnHand <= 0` -> `out_of_stock`
- `lowStockMode === "reorder_point"` and `quantityOnHand <= reorderPoint` -> `low_stock`
- `lowStockMode === "low_stock_threshold"` and `quantityOnHand <= lowStockThreshold` -> `low_stock`
- otherwise -> `in_stock`

### 4. Backend Pagination And Sorting

Filtering is already started in the baseline. Add reusable backend pagination and sorting on top of
that list-query behavior.

Expected behavior:

- List endpoints support `page`, `limit`, `sort`, and `order`.
- List endpoints return a consistent paginated response shape.
- Filters support simple operator syntax such as `eq:value` and `ilike:value`.
- Unsupported filters, operators, sort fields, or invalid pagination values should return `400`.
- Resource-specific allowlists should stay close to the resource.

Apply this to:

- `GET /warehouses`
- `GET /items`
- `GET /item-categories`
- `GET /inventory`

Expected filters:

- Warehouses: `code`, `name`, `city`, `status`
- Items: `sku`, `name`, `category`, `status`
- Item categories: `name`
- Inventory: `warehouseCode`, `warehouseName`, `itemSku`, `itemName`, `category`, `status`

Use `ilike` for text search fields and `eq` for enum/exact-match fields such as `status`.

### 5. Frontend Tables And Query State

Add reusable frontend table/query behavior.

Expected behavior:

- Resource pages support pagination, sorting, filtering, loading states, error states, and retry.
- Sorting should be driven by table/page state, not hardcoded per request.
- Filter changes should reset the page.
- The table should avoid layout jumps during loading.
- Shared table/query behavior should be reusable across warehouses, items, categories, and inventory.
- Use Jotai for shared feature/query state where multiple components need the same state.
- Use TanStack React Query for server writes.

### 6. Dashboard

Build the dashboard from the inventory data.

Expected behavior:

- Show inventory summary counts.
- Show low-stock inventory rows.
- Show low-stock grouping by category.

## Setup

Use standard npm/node commands. No Bun/Docker available in this environment.
 I will adapt the setup.
