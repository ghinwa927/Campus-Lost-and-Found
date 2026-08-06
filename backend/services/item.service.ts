import { ObjectId } from "mongodb";

import { ItemRepository } from "../repositories/item.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";

import type {
  CreateItemInput,
  UpdateItemInput,
  Item,
} from "../types/item.types.js";

import type { ItemQuery } from "../types/item-query.types.js";

export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  private async resolveCategoryId(categoryId: string): Promise<ObjectId> {
    if (ObjectId.isValid(categoryId)) {
      const existingCategory = await this.categoryRepository.findById(
        new ObjectId(categoryId)
      );

      if (existingCategory) {
        return existingCategory._id as ObjectId;
      }
    }

    const fallbackCategory = await this.categoryRepository.findBySlug("general");

    if (fallbackCategory?._id) {
      return fallbackCategory._id as ObjectId;
    }

    const createdCategory = await this.categoryRepository.create({
      name: "General",
      slug: "general",
      icon: "📦",
    });

    return createdCategory._id as ObjectId;
  }

  async getAllItems(query: ItemQuery = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (
      query.categoryId &&
      !ObjectId.isValid(query.categoryId)
    ) {
      throw new Error("Invalid category ID");
    }

    const result = await this.itemRepository.findAll(query);

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        totalItems: result.totalItems,
        totalPages: Math.ceil(
          result.totalItems / limit
        ),
      },
    };
  }

  async getItemById(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid item ID");
    }

    return this.itemRepository.findById(
      new ObjectId(id)
    );
  }

  async createItem(data: CreateItemInput) {
    const resolvedCategoryId = await this.resolveCategoryId(data.categoryId);
    const category = await this.categoryRepository.findById(resolvedCategoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    const now = new Date();

    const item: Item = {
      title: data.title,
      type: data.type,
      categoryId: resolvedCategoryId,
      description: data.description,
      location: data.location,
      date: new Date(data.date),
      imageUrl: data.imageUrl,
      reporterName: data.reporterName,
      reporterEmail: data.reporterEmail,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    return this.itemRepository.create(item);
  }

  async updateItem(
    id: string,
    data: UpdateItemInput
  ) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid item ID");
    }

    const updateData: Partial<Item> = {};

    if (data.title !== undefined)
      updateData.title = data.title;

    if (data.type !== undefined)
      updateData.type = data.type;

    if (data.description !== undefined)
      updateData.description = data.description;

    if (data.location !== undefined)
      updateData.location = data.location;

    if (data.reporterName !== undefined)
      updateData.reporterName = data.reporterName;

    if (data.reporterEmail !== undefined)
      updateData.reporterEmail = data.reporterEmail;

    if (data.imageUrl !== undefined)
      updateData.imageUrl = data.imageUrl;

    if (data.status !== undefined)
      updateData.status = data.status;

    if (data.date !== undefined) {
      updateData.date = new Date(data.date);
    }

    if (data.categoryId !== undefined) {
      const resolvedCategoryId = await this.resolveCategoryId(data.categoryId);
      const category = await this.categoryRepository.findById(resolvedCategoryId);

      if (!category) {
        throw new Error("Category not found");
      }

      updateData.categoryId = resolvedCategoryId;
    }

    return this.itemRepository.update(
      new ObjectId(id),
      updateData
    );
  }

  async deleteItem(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid item ID");
    }

    return this.itemRepository.delete(
      new ObjectId(id)
    );
  }
}