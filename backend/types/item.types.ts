import { ObjectId } from "mongodb";

export type ItemType = "lost" | "found";
export type ItemStatus = "active" | "resolved";

export interface Item {
  _id?: ObjectId | undefined;
  title: string;
  type: ItemType;
  categoryId: ObjectId;
  description: string;
  location: string;
  date: Date;
  imageUrl?: string | undefined;
  reporterName: string;
  reporterEmail: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemInput {
  title: string;
  type: ItemType;
  categoryId: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  reporterName: string;
  reporterEmail: string;
}

export interface UpdateItemInput {
  title?: string;
  type?: ItemType;
  categoryId?: string;
  description?: string;
  location?: string;
  date?: string;
  imageUrl?: string;
  reporterName?: string;
  reporterEmail?: string;
  status?: ItemStatus;
}