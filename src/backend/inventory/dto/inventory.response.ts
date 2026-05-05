import { Inventory } from "../inventory.entity";
import { InventoryPolicy } from "../../inventory-policies/inventory-policy.entity";

export type InventoryStatus = "out_of_stock" | "low_stock" | "in_stock";

export class InventoryResponse {
	id!: string;
	warehouseId!: string;
	warehouseCode!: string;
	warehouseName!: string;
	itemId!: string;
	itemSku!: string;
	itemName!: string;
	category!: string;
	quantityOnHand!: number;
	reorderPoint!: number;
	status!: InventoryStatus;
	updatedAt!: Date;

	static from(inventory: Inventory, policy: InventoryPolicy): InventoryResponse {
		const response = new InventoryResponse();
		response.id = inventory.id;
		response.warehouseId = inventory.warehouseId;
		response.warehouseCode = inventory.warehouse.code;
		response.warehouseName = inventory.warehouse.name;
		response.itemId = inventory.itemId;
		response.itemSku = inventory.item.sku;
		response.itemName = inventory.item.name;
		response.category = inventory.item.category.name;
		response.quantityOnHand = inventory.quantityOnHand;
		response.reorderPoint = inventory.reorderPoint;
		response.updatedAt = inventory.updatedAt;
		response.status = deriveStatus(inventory, policy);
		return response;
	}
}

export function deriveStatus(inventory: Inventory, policy: InventoryPolicy): InventoryStatus {
	if (inventory.quantityOnHand <= 0) {
		return "out_of_stock";
	}

	if (policy.lowStockMode === "reorder_point") {
		if (inventory.quantityOnHand <= inventory.reorderPoint) {
			return "low_stock";
		}
	} else if (policy.lowStockMode === "low_stock_threshold") {
		if (inventory.quantityOnHand <= policy.lowStockThreshold) {
			return "low_stock";
		}
	}

	return "in_stock";
}
