import { Module } from "@nestjs/common";
import { InventoryPoliciesModule } from "../inventory-policies/inventory-policies.module";
import { InventoryModule } from "../inventory/inventory.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
	imports: [InventoryModule, InventoryPoliciesModule],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
