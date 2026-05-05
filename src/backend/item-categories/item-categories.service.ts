import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { FilterQueryBuilder } from "../common/query/filter-query-builder";
import { Item } from "../items/item.entity";
import { ItemCategory } from "./item-category.entity";
import { ItemCategoryFilterRequest } from "./dto/item-category-filter.request";
import { ItemCategoryRequest } from "./dto/item-category.request";

@Injectable()
export class ItemCategoriesService {
	constructor(
		@InjectRepository(ItemCategory)
		private readonly categoryRepository: Repository<ItemCategory>,
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>,
	) {}

	async findAll(filter: ItemCategoryFilterRequest) {
		const queryBuilder = this.categoryRepository
			.createQueryBuilder("item_categories")
			.orderBy("item_categories.name", "ASC");

		return new FilterQueryBuilder(queryBuilder).applyFilter(filter).getMany();
	}

	async findById(id: string) {
		const category = await this.categoryRepository.findOneBy({ id });
		if (!category) {
			throw new NotFoundException(`Category '${id}' not found`);
		}
		return category;
	}

	async create(request: ItemCategoryRequest) {
		await this.assertNameAvailable(request.name);
		const category = this.categoryRepository.create({ name: request.name.trim() });
		return this.categoryRepository.save(category);
	}

	async update(id: string, request: ItemCategoryRequest) {
		const category = await this.findById(id);
		await this.assertNameAvailable(request.name, id);
		category.name = request.name.trim();
		return this.categoryRepository.save(category);
	}

	async remove(id: string) {
		await this.findById(id);
		const itemCount = await this.itemRepository.countBy({ categoryId: id });
		if (itemCount > 0) {
			throw new ConflictException("Category cannot be deleted while it is used by items");
		}
		await this.categoryRepository.delete(id);
	}

	private async assertNameAvailable(name: string, currentId?: string) {
		const where = currentId ? { name, id: Not(currentId) } : { name };
		const existing = await this.categoryRepository.findOneBy(where);
		if (existing) {
			throw new ConflictException(`Category name '${name}' is already in use`);
		}
	}
}
