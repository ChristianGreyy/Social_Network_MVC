const mongoose = require("mongoose");
/* eslint-disable no-param-reassign */
const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginateAggregrate = async function (filter, options) {
    let sort = {};
    if (options.sortBy) {
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sort[key] = order === "desc" ? -1 : 1;
      });
    } else {
      sort["createdAt"] = 1;
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 100;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    // let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    for (let i in filter) {
      if (
        typeof filter[i] !== "object" &&
        filter[i].match(/^[0-9a-fA-F]{24}$/)
      ) {
        filter[i] = mongoose.Types.ObjectId(filter[i]);
      }
    }
    let queryArray = [
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ];

    console.log("populate", options.populatePk);

    if (options.populateFk) {
      options.populateFk.split(",").forEach((populateOption) => {
        const [collection, field] = populateOption.split(".");
        queryArray.push({
          $lookup: {
            from: collection,
            localField: "_id" /* field when store in this's collection */,
            foreignField: field /* field when store in from's collection */,
            as: collection,
          },
        });
      });
    }

    if (options.populatePk) {
      options.populatePk.split(",").forEach((populateOption) => {
        const [collection, field] = populateOption.split(".");
        console.log(collection, field);
        queryArray.push({
          $lookup: {
            from: collection,
            localField: field /* field when store in this's collection */,
            foreignField: "_id" /* field when store in from's collection */,
            as: field,
          },
        });
      });
    }

    let docsPromise = this.aggregate(queryArray);

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
