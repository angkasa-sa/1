import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ItemCategoryRequest {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name!: string;
}
