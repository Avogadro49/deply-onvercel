class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    // Create query strings
    const reqQuery = { ...this.queryString };
    const removeFields = ["select", "sort", "page", "limit", "include"];

    // Remove fields that aren't for filtering
    removeFields.forEach((param) => delete reqQuery[param]);

    // Convert query object to string and replace operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Assign the modified query to the current query instance
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  includeRelationships() {
    if (this.queryString.include) {
      const relationships = this.queryString.include.split(",");
      if (relationships.includes("courses")) {
        this.query = this.query.populate("courses");
      }
    }
    return this;
  }

  select() {
    if (this.queryString.select) {
      const fields = this.queryString.select.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  async paginate() {
    const page = Math.max(this.queryString.page * 1 || 1, 1);
    const limit = Math.max(this.queryString.limit * 1 || 100, 1);
    const skip = (page - 1) * limit;

    this.totalDocuments = await this.query.model.countDocuments();
    const totalPages = Math.ceil(this.totalDocuments / limit);

    if (skip >= this.totalDocuments && this.totalDocuments > 0) {
      throw new Error("This page does not exist");
    }

    this.query = this.query.skip(skip).limit(limit);

    this.pagination = {
      currentPage: page,
      totalPages,
      limit,
      totalDocuments: this.totalDocuments,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };

    return this;
  }
}

module.exports = ApiFeatures;
