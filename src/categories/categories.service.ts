import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const name = String(createCategoryDto?.name || '').trim();
    if (!name) throw new BadRequestException('Category name is required');
    const duplicate = await this.categoryModel.findOne({ name });
    if (duplicate) throw new ConflictException('A category with this name already exists');
    const createdCategory = new this.categoryModel({ ...createCategoryDto, name });
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    if (updateCategoryDto?.name !== undefined) {
      const name = String(updateCategoryDto.name).trim();
      if (!name) throw new BadRequestException('Category name is required');
      const duplicate = await this.categoryModel.findOne({ name, _id: { $ne: id } });
      if (duplicate) throw new ConflictException('A category with this name already exists');
      updateCategoryDto = { ...updateCategoryDto, name };
    }
    const existingCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
    if (!existingCategory) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return existingCategory;
  }

  async remove(id: string): Promise<any> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deletedCategory) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return deletedCategory;
  }
}
