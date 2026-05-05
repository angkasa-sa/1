import type { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import type { BaseFilter } from "../filter";

export class FilterQueryBuilder<T extends ObjectLiteral> {
	constructor(private readonly queryBuilder: SelectQueryBuilder<T>) {}

	applyFilter(filter: BaseFilter): this {
		filter.applyTo(this.queryBuilder);
		return this;
	}

	getMany(): Promise<T[]> {
		return this.queryBuilder.getMany();
	}

    // Extended for pagination and sorting as requested in task 4
    async getPaginated(pagination: { page?: number; limit?: number; sort?: string; order?: 'ASC' | 'DESC' }) {
        const page = Math.max(1, pagination.page || 1);
        const limit = Math.max(1, Math.min(100, pagination.limit || 10));
        const skip = (page - 1) * limit;

        if (pagination.sort) {
            this.queryBuilder.orderBy(pagination.sort, pagination.order || 'ASC');
        }

        const [items, total] = await this.queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            data: items,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }
}
