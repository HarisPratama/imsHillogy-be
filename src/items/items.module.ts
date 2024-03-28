import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/schemas/item.schema';
import { Threshold, ThresholdSchema } from 'src/schemas/threshold.schema';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Threshold.name, schema: ThresholdSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
