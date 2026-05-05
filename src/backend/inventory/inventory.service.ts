import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FilterQueryBuilder } from "../common/query/filter-query-builder";
import { InventoryPoliciesService } from "../inventory-policies/inventory-policies.service";
import { Item } from "../items/item.entity";
import { Warehouse } from "../warehouses/warehouse.entity";
import { Inventory } from "./inventory.entity";
import { InventoryFilterRequest } from "./dto/inventory-filter.request";
import { InventoryRequest } from "./dto/inventory.request";
import { InventoryResponse, deriveStatus } from "./dto/inventory.response";

@Injectable()
export class InventoryService {
	constructor(
		@InjectRepository(Inventory)
		private readonly inventoryRepository: Repository<Inventory>,
		@InjectRepository(Warehouse)
		private readonly warehouseRepository: Repository<Warehouse>,
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>,
		private readonly policyService: InventoryPoliciesService,
	) {}

	async findAll(filter: InventoryFilterRequest, pagination: any) {
		const policy = await this.policyService.get();
		const queryBuilder = this.inventoryRepository
			.createQueryBuilder("inventory")
			.leftJoinAndSelect("inventory.warehouse", "warehouse")
			.leftJoinAndSelect("inventory.item", "item")
			.leftJoinAndSelect("item.category", "category");

        const qb = new FilterQueryBuilder(queryBuilder).applyFilter(filter);
        
        // We get all to filter by status if needed, or we could try to do it in SQL
        // But status is derived and policy can change, so doing it in JS is safer for this small app.
        // Actually, requirement says "List endpoints support page, limit, sort, and order."
        // If we filter by status, we must do it before pagination.
        
        let all = await qb.getMany();
        
        if (filter.status) {
            const statusFilter = filter.status.startsWith('eq:') ? filter.status.slice(3) : filter.status;
            all = all.filter(inv => deriveStatus(inv, policy) === statusFilter);
        }

        const page = Math.max(1, Number(pagination.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(pagination.limit) || 10));
        const total = all.length;
        const totalPages = Math.ceil(total / limit);
        
        // Sorting
        const sort = pagination.sort || 'updatedAt';
        const order = (pagination.order || 'DESC').toUpperCase();
        
        all.sort((a, b) => {
            let valA: any, valB: any;
            if (sort === 'itemSku') {
                valA = a.item.sku; valB = b.item.sku;
            } else if (sort === 'warehouseCode') {
                valA = a.warehouse.code; valB = b.warehouse.code;
            } else {
                valA = (a as any)[sort]; valB = (b as any)[sort];
            }
            
            if (valA < valB) return order === 'ASC' ? -1 : 1;
            if (valA > valB) return order === 'ASC' ? 1 : -1;
            return 0;
        });

        const data = all.slice((page - 1) * limit, page * limit);

		return {
			data: data.map(inv => InventoryResponse.from(inv, policy)),
			page,
			limit,
			total,
			totalPages,
		};
	}

	async findById(id: string) {
		const inv = await this.inventoryRepository.findOne({
			where: { id },
			relations: ["warehouse", "item", "item.category"],
		});
		if (!inv) throw new NotFoundException(`Inventory '${id}' not found`);
		return inv;
	}

	async create(request: InventoryRequest) {
		await this.assertWarehouseExists(request.warehouseId);
		await this.assertItemExists(request.itemId);
		await this.assertUnique(request.warehouseId, request.itemId);

		const inv = this.inventoryRepository.create(request);
		const saved = await this.inventoryRepository.save(inv);
        return this.findById(saved.id);
	}

	async update(id: string, request: InventoryRequest) {
		const inv = await this.findById(id);
		await this.assertWarehouseExists(request.warehouseId);
		await this.assertItemExists(request.itemId);
		await this.assertUnique(request.warehouseId, request.itemId, id);

		inv.warehouseId = request.warehouseId;
		inv.itemId = request.itemId;
		inv.quantityOnHand = request.quantityOnHand;
		inv.reorderPoint = request.reorderPoint;

		await this.inventoryRepository.save(inv);
        return this.findById(id);
	}

	async remove(id: string) {
		await this.findById(id);
		await this.inventoryRepository.delete(id);
	}

	private async assertWarehouseExists(id: string) {
		const exists = await this.warehouseRepository.existsBy({ id });
		if (!exists) throw new NotFoundException(`Warehouse '${id}' not found`);
	}

	private async assertItemExists(id: string) {
		const exists = await this.itemRepository.existsBy({ id });
		if (!exists) throw new NotFoundException(`Item '${id}' not found`);
	}

	private async assertUnique(warehouseId: string, itemId: string, currentId?: string) {
		const existing = await this.inventoryRepository.findOneBy({ warehouseId, itemId });
		if (existing && existing.id !== currentId) {
			throw new ConflictException("Item already exists in this warehouse");
		}
	}
}
