import { IsInt, IsIn, Min } from "class-validator";
import { LowStockMode } from "../inventory-policy.entity";

export class InventoryPolicyRequest {
	@IsIn(["reorder_point", "low_stock_threshold"])
	lowStockMode!: LowStockMode;

	@IsInt()
	@Min(0)
	lowStockThreshold!: number;
}
