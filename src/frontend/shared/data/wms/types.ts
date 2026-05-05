export interface Warehouse {
	id: string;
	code: string;
	name: string;
	city: string;
	status: "active" | "inactive";
	createdAt: string;
}

export interface Item {
	id: string;
	sku: string;
	name: string;
	categoryId: string;
	category: string;
	unit: string;
	status: "active" | "discontinued";
	createdAt: string;
}

export interface ItemCategory {
    id: string;
    name: string;
    createdAt: string;
}

export interface Inventory {
    id: string;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    itemId: string;
    itemSku: string;
    itemName: string;
    category: string;
    quantityOnHand: number;
    reorderPoint: number;
    status: "out_of_stock" | "low_stock" | "in_stock";
    updatedAt: string;
}

export interface InventoryPolicy {
    id: string;
    lowStockMode: "reorder_point" | "low_stock_threshold";
    lowStockThreshold: number;
    updatedAt: string;
}

export type WarehousePayload = Pick<Warehouse, "code" | "name" | "city" | "status">;
export type ItemPayload = Pick<Item, "sku" | "name" | "categoryId" | "unit" | "status">;
export type InventoryPayload = Pick<Inventory, "warehouseId" | "itemId" | "quantityOnHand" | "reorderPoint">;
export type ItemCategoryPayload = Pick<ItemCategory, "name">;
