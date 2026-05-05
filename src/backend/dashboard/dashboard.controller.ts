import { Controller, Get, Query } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
	constructor(private readonly dashboardService: DashboardService) {}

	@Get("inventory-status-summary")
	getStatusSummary() {
		return this.dashboardService.getStatusSummary();
	}

	@Get("low-stock-by-category")
	getLowStockByCategory() {
		return this.dashboardService.getLowStockByCategory();
	}

	@Get("low-stock-items")
	getLowStockItems(@Query("limit") limit?: string) {
		return this.dashboardService.getLowStockItems(limit ? Number(limit) : 10);
	}
}
