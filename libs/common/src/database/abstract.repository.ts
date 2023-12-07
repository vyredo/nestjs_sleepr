import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './astract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    this.logger.debug(`Creating document ${this.model.modelName}...`);
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    this.logger.debug(`Finding one document ${this.model.modelName}...`);
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(`Document not found with filterquery`, filterQuery);
      throw new NotFoundException(`Document not found`);
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(`Document not found with filterquery`, filterQuery);
      throw new NotFoundException(`Document not found`);
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    this.logger.debug(`Finding documents ${this.model.modelName}...`);
    const documents = await this.model
      .find(filterQuery)
      .lean<TDocument[]>(true);
    if (!documents) {
      this.logger.warn(`Document not found with filterquery`, filterQuery);
      throw new NotFoundException(`Documents not found`);
    }

    return documents;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | null> {
    const doc = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);
    if (!doc) {
      this.logger.warn(`Document not found with filterquery`, filterQuery);
      return null;
    }
    return doc;
  }
}
