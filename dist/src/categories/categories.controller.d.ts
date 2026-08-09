import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    findAll(): Promise<import("./schemas/category.schema").Category[]>;
    findOne(id: string): Promise<import("./schemas/category.schema").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    remove(id: string): Promise<any>;
}
