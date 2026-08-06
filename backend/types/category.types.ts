import { ObjectId } from "mongodb";

export interface Category {
  _id?: ObjectId;
  name: string;
  slug: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  icon?: string;
}