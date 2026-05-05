import { Body, Controller, Get, Put } from "@nestjs/common";
import { InventoryPolicyRequest } from "./dto/inventory-policy.request";
import { InventoryPoliciesService } from "./inventory-policies.service";

@Controller("inventory-policy")
export class InventoryPoliciesController {
	constructor(private readonly policyService: InventoryPoliciesService) {}

	@Get()
	get() {
		return this.policyService.get();
	}

	@Put()
	update(@Body() request: InventoryPolicyRequest) {
		return this.policyService.update(request);
	}
}
