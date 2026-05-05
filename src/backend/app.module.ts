import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ItemsModule } from "./items/items.module";
import { WarehousesModule } from "./warehouses/warehouses.module";
import { ItemCategoriesModule } from "./item-categories/item-categories.module";
import { InventoryModule } from "./inventory/inventory.module";
import { InventoryPoliciesModule } from "./inventory-policies/inventory-policies.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
	imports: [
		DatabaseModule,
		WarehousesModule,
		ItemsModule,
		ItemCategoriesModule,
		InventoryModule,
		InventoryPoliciesModule,
		DashboardModule,
	],
})
export class AppModule {}
