import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inventory } from "../inventory/inventory.entity";
import { InventoryPolicy } from "../inventory-policies/inventory-policy.entity";
import { ItemCategory } from "../item-categories/item-category.entity";
import { Item } from "../items/item.entity";
import { Warehouse } from "../warehouses/warehouse.entity";

const entities = [Warehouse, ItemCategory, Item, Inventory, InventoryPolicy];

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => {
				return {
					type: "sqlite",
					database: "mini_wms.sqlite",
					entities,
					synchronize: true, // Should be false in production, but okay for this test
					dropSchema: false,
					retryAttempts: 3,
				};
			},
		}),
	],
})
export class DatabaseModule {}
