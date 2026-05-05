import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { INVENTORY_POLICY_ID, InventoryPolicy } from "./inventory-policy.entity";
import { InventoryPolicyRequest } from "./dto/inventory-policy.request";

@Injectable()
export class InventoryPoliciesService implements OnModuleInit {
	constructor(
		@InjectRepository(InventoryPolicy)
		private readonly policyRepository: Repository<InventoryPolicy>,
	) {}

	async onModuleInit() {
		const policy = await this.policyRepository.findOneBy({ id: INVENTORY_POLICY_ID });
		if (!policy) {
			await this.policyRepository.save({
				id: INVENTORY_POLICY_ID,
				lowStockMode: "reorder_point",
				lowStockThreshold: 10,
			});
		}
	}

	async get() {
		return this.policyRepository.findOneByOrFail({ id: INVENTORY_POLICY_ID });
	}

	async update(request: InventoryPolicyRequest) {
		const policy = await this.get();
		policy.lowStockMode = request.lowStockMode;
		policy.lowStockThreshold = request.lowStockThreshold;
		return this.policyRepository.save(policy);
	}
}
