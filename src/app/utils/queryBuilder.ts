import { Query } from "mongoose";

export class QueryBuilder {
  public modelQuery: Query<any, any>;
  public query: any;
  constructor(modelQuery: Query<any, any>, query: any) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  filter() {
    const filter = { ...this.query };
    const excludeFields = ["sort", "limit", "page", "fields"];
    for (const field of excludeFields) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  sort() {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(this.query.sort);
    return this;
  }

  pagination() {
    const page = this.query.page || 1;
    const limit = this.query.limit || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  selectFields() {
    const rawFields = this.query.fields;
    const fields = rawFields ? (rawFields as string).split(",").join(" ") : "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  build() {
    return this.modelQuery;
  }
}
