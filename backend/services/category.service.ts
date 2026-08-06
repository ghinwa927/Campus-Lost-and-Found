import { ObjectId } from "mongodb";
import { CategoryRepository } from "../repositories/category.repository.js";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../types/category.types.js";

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getAllCategories() {
    return this.repository.findAll();
  }

  async getCategoryById(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    return this.repository.findById(new ObjectId(id));
  }

  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await this.repository.findBySlug(data.slug);

    if (existingCategory) {
      throw new Error("Category with this slug already exists");
    }

    return this.repository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    return this.repository.update(new ObjectId(id), data);
  }

  async deleteCategory(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    return this.repository.delete(new ObjectId(id));
  }
}