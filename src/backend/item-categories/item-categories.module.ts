import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "../items/item.entity";
import { ItemCategory } from "./item-category.entity";
import { ItemCategoriesController } from "./item-categories.controller";
import { ItemCategoriesService } from "./item-categories.service";

@Module({
	imports: [TypeOrmModule.forFeature([ItemCategory, Item])],
	controllers: [ItemCategoriesController],
	providers: [ItemCategoriesService],
	exports: [ItemCategoriesService],
})
export class ItemCategoriesModule {}
