import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { InventoryFilterRequest } from "./dto/inventory-filter.request";
import { InventoryRequest } from "./dto/inventory.request";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {
	constructor(private readonly inventoryService: InventoryService) {}

	@Get()
	findAll(@Query() filter: InventoryFilterRequest, @Query() pagination: any) {
		return this.inventoryService.findAll(filter, pagination);
	}

	@Get(":id")
	async findById(@Param("id") id: string) {
        // Need to wrap in response DTO for consistent return
		return this.inventoryService.findById(id);
	}

	@Post()
	create(@Body() request: InventoryRequest) {
		return this.inventoryService.create(request);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() request: InventoryRequest) {
		return this.inventoryService.update(id, request);
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		await this.inventoryService.remove(id);
		return { ok: true };
	}
}
