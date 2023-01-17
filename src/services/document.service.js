const httpStatus = require("http-status");
const { Document, Post } = require("../models");
const { postService } = require(".");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");

/**
 * Create a document
 * @param {Object} documentBody
 * @returns {Promise<Document>}
 */
const createDocument = async (documentBody) => {
  const newDocument = await Document.create(documentBody);
  return newDocument;
};

/**
 * Query for documents
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDocuments = async (filter, options) => {
  const documents = await Document.paginate(filter, options);
  return documents;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Document>}
 */
const getDocumentById = async (id) => {
  return Document.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Document>}
 */
const getDocumentByEmail = async (email) => {
  return Document.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Document>}
 */
const updateDocumentById = async (userId, updateBody) => {
  const user = await getDocumentById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Document not found");
  }
  if (
    updateBody.email &&
    (await Document.isEmailTaken(updateBody.email, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Document>}
 */
const deleteDocumentById = async (userId) => {
  const user = await getDocumentById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Document not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createDocument,
  queryDocuments,
  getDocumentById,
  getDocumentByEmail,
  updateDocumentById,
  deleteDocumentById,
};
