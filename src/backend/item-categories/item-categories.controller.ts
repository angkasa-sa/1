import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ItemCategoryFilterRequest } from "./dto/item-category-filter.request";
import { ItemCategoryRequest } from "./dto/item-category.request";
import { ItemCategoriesService } from "./item-categories.service";

@Controller("item-categories")
export class ItemCategoriesController {
	constructor(private readonly itemCategoriesService: ItemCategoriesService) {}

	@Get()
	findAll(@Query() filter: ItemCategoryFilterRequest) {
		return this.itemCategoriesService.findAll(filter);
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.itemCategoriesService.findById(id);
	}

	@Post()
	create(@Body() request: ItemCategoryRequest) {
		return this.itemCategoriesService.create(request);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() request: ItemCategoryRequest) {
		return this.itemCategoriesService.update(id, request);
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		await this.itemCategoriesService.remove(id);
		return { ok: true };
	}
}
