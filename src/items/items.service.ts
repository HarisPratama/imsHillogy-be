import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateItemDto, CreateTransactionDto } from 'src/dto/item.dto';
import { Item } from 'src/schemas/item.schema';
import { Threshold } from 'src/schemas/threshold.schema';
import { Transaction } from 'src/schemas/transaction.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Threshold.name) private thresholdModel: Model<Threshold>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async findItem() {
    return this.itemModel.find();
  }

  async create(createItemDto: CreateItemDto) {
    const createItem = new this.itemModel(createItemDto);
    return createItem.save();
  }

  async findItemById(id: string): Promise<Item> {
    return this.itemModel.findById(new Types.ObjectId(id));
  }

  async update(createItemDto: CreateItemDto) {
    return this.itemModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(createItemDto._id),
      },
      createItemDto,
    );
  }

  async findTransaction() {
    return this.transactionModel.find();
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const create = new this.transactionModel(createTransactionDto);
    return create.save();
  }

  async delete(id: string) {
    return this.itemModel.findByIdAndDelete(id);
  }

  async updateThreshold(data: { value: number }) {
    const findItem = await this.thresholdModel.find();
    if (findItem.length > 0) {
      return this.thresholdModel.findOneAndUpdate(
        {
          value: { $gte: 0 },
        },
        data,
      );
    } else {
      const createItem = new this.thresholdModel(data);
      return createItem.save();
    }
  }

  async getThreshold() {
    return this.thresholdModel.findOne();
  }

  async getItemLessThanThreshold(threshold: number) {
    return this.itemModel.find({
      quantity: { $lte: threshold },
    });
  }
}
