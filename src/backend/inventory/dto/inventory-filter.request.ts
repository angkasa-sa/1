import { IsOptional, IsString } from "class-validator";
import { BaseFilter, FilterOperator, Operator } from "../../common/filter";

export class InventoryFilterRequest extends BaseFilter {
	@Operator(FilterOperator.ILIKE, { path: "warehouse.code" })
	@IsOptional()
	@IsString()
	warehouseCode?: string;

	@Operator(FilterOperator.ILIKE, { path: "warehouse.name" })
	@IsOptional()
	@IsString()
	warehouseName?: string;

	@Operator(FilterOperator.ILIKE, { path: "item.sku" })
	@IsOptional()
	@IsString()
	itemSku?: string;

	@Operator(FilterOperator.ILIKE, { path: "item.name" })
	@IsOptional()
	@IsString()
	itemName?: string;

	@Operator(FilterOperator.ILIKE, { path: "category.name" })
	@IsOptional()
	@IsString()
	category?: string;

    @IsOptional()
    @IsString()
    status?: string; // Managed manually in service because it's derived
}
