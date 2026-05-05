import { Injectable } from "@nestjs/common";
import { InventoryPoliciesService } from "../inventory-policies/inventory-policies.service";
import { InventoryService } from "../inventory/inventory.service";
import { InventoryResponse, deriveStatus } from "../inventory/dto/inventory.response";

@Injectable()
export class DashboardService {
	constructor(
		private readonly inventoryService: InventoryService,
		private readonly policyService: InventoryPoliciesService,
	) {}

	async getStatusSummary() {
		const policy = await this.policyService.get();
        // findAll returns paginated, but I need counts.
        // Actually I should query repo directly or add a new method.
        // For consistency I'll use repo later if needed.
        const res = await this.inventoryService.findAll({}, { limit: 1000 });
        const data = res.data;

		return {
			totalRows: data.length,
			inStockRows: data.filter((i) => i.status === "in_stock").length,
			lowStockRows: data.filter((i) => i.status === "low_stock").length,
			outOfStockRows: data.filter((i) => i.status === "out_of_stock").length,
		};
	}

	async getLowStockByCategory() {
		const res = await this.inventoryService.findAll({ status: 'eq:low_stock' }, { limit: 1000 });
        const outRes = await this.inventoryService.findAll({ status: 'eq:out_of_stock' }, { limit: 1000 });
        const allLow = [...res.data, ...outRes.data];

		const counts: Record<string, number> = {};
		for (const item of allLow) {
			counts[item.category] = (counts[item.category] || 0) + 1;
		}

		return Object.entries(counts).map(([category, count]) => ({ category, count }));
	}

	async getLowStockItems(limit = 10) {
		const res = await this.inventoryService.findAll({}, { limit: 1000 });
        const data = res.data;
        
        return data
            .filter(i => i.status !== 'in_stock')
            .sort((a, b) => {
                // Priority: out_of_stock > low_stock
                if (a.status === 'out_of_stock' && b.status !== 'out_of_stock') return -1;
                if (a.status !== 'out_of_stock' && b.status === 'out_of_stock') return 1;
                return b.quantityOnHand - a.quantityOnHand; // Sort by quantity within same status
            })
            .slice(0, limit);
	}
}
