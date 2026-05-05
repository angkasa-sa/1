import { IsOptional, IsString } from "class-validator";
import { BaseFilter, FilterOperator, Operator } from "../../common/filter";

export class ItemCategoryFilterRequest extends BaseFilter {
	@Operator(FilterOperator.ILIKE, { path: "item_categories.name" })
	@IsOptional()
	@IsString()
	name?: string;
}
