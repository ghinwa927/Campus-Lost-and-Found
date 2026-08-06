import { Db, ObjectId } from "mongodb";
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../types/category.types.js";

export class CategoryRepository {
  private collection;

  constructor(db: Db) {
    this.collection = db.collection<Category>("categories");
  }

  async findAll() {
    return this.collection.find().sort({ name: 1 }).toArray();
  }

  async findById(id: ObjectId) {
    return this.collection.findOne({ _id: id });
  }

  async findBySlug(slug: string) {
    return this.collection.findOne({ slug });
  }

  async create(data: CreateCategoryInput) {
    const now = new Date();

    const category: Category = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(category);

    return {
      ...category,
      _id: result.insertedId,
    };
  }

  async update(id: ObjectId, data: UpdateCategoryInput) {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result;
  }

  async delete(id: ObjectId) {
    return this.collection.deleteOne({ _id: id });
  }
}