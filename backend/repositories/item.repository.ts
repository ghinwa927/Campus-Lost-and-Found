import { Db, ObjectId } from "mongodb";
import type { Filter } from "mongodb";

import type { Item } from "../types/item.types.js";
import type { ItemQuery } from "../types/item-query.types.js";

export class ItemRepository {
  private collection;

  constructor(db: Db) {
    this.collection = db.collection<Item>("items");
  }

  async findAll(query: ItemQuery = {}) {
    const filter: Filter<Item> = {};

    // Filter by type
    if (query.type) {
      filter.type = query.type;
    }

    // Filter by category
    if (query.categoryId) {
      filter.categoryId = new ObjectId(query.categoryId);
    }

    // Filter by location
    if (query.location) {
      filter.location = {
        $regex: query.location,
        $options: "i",
      };
    }

    // Filter by status
    if (query.status) {
      filter.status = query.status;
    }

    // Search
    if (query.search) {
      const searchRegex = {
        $regex: query.search,
        $options: "i",
      };

      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Pagination
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),

      this.collection.countDocuments(filter),
    ]);

    return {
      items,
      totalItems,
    };
  }

  async findById(id: ObjectId) {
    return this.collection.findOne({ _id: id });
  }

  async create(item: Item) {
    const result = await this.collection.insertOne(item);

    return {
      ...item,
      _id: result.insertedId,
    };
  }

  async update(id: ObjectId, data: Partial<Item>) {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );

    return result;
  }

  async delete(id: ObjectId) {
    return this.collection.deleteOne({
      _id: id,
    });
  }
}