import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import { CreateItemDto, CreateTransactionDto } from 'src/dto/item.dto';
import { ItemsService } from './items.service';

@ApiHeader({
  name: 'Authorization',
  description: 'Value is Bearer {{access_token}}',
})
@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createItem(@Body() createItemDto: CreateItemDto, @Res() res: Response) {
    try {
      const createItem = await this.itemService.create(createItemDto);
      res.status(201).json({
        status: 'success',
        data: createItem,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getItems(@Res() res: Response) {
    try {
      const getItems = await this.itemService.findItem();
      res.status(201).json({
        status: 'Success',
        data: getItems,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('transaction')
  async getTransaction(@Res() res: Response) {
    try {
      const getTransaction = await this.itemService.findTransaction();
      res.status(201).json({
        status: 'Success',
        data: getTransaction,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('threshold')
  async getThreshold(@Res() res: Response) {
    try {
      const threshold = await this.itemService.getThreshold();
      res.status(201).json({
        status: 'success',
        data: threshold,
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('item-threshold')
  async getItemlessThanThreshold(@Res() res: Response) {
    try {
      const threshold = await this.itemService.getThreshold();
      const items = await this.itemService.getItemLessThanThreshold(
        threshold.value,
      );
      res.status(201).json({
        status: 'success',
        data: items,
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('threshold')
  async updateThresholdItem(
    @Body() createItemDto: { value: number },
    @Res() res: Response,
  ) {
    try {
      const createItem = await this.itemService.updateThreshold(createItemDto);
      res.status(201).json({
        status: 'success',
        data: createItem,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('transaction')
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res: Response,
  ) {
    try {
      const findItem = await this.itemService.findItemById(
        createTransactionDto.itemId,
      );
      if (findItem.name.length > 0) {
        createTransactionDto.revenue =
          createTransactionDto.price * createTransactionDto.quantity;
        await this.itemService.createTransaction(createTransactionDto);

        const updateedItem: CreateItemDto = {
          name: findItem.name,
          description: findItem.description,
          quantity: findItem.quantity - createTransactionDto.quantity,
          price: findItem.price,
        };

        const createItem = await this.itemService.update({
          _id: createTransactionDto.itemId,
          ...updateedItem,
        });
        res.status(201).json({
          status: 'success',
          previous: createItem,
          updated: updateedItem,
        });
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getItem(@Param() params: any, @Res() res: Response) {
    try {
      const getItem = await this.itemService.findItemById(params.id);
      res.status(200).json({
        status: 'Success',
        data: getItem,
        id: params.id,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateItem(
    @Param() params: any,
    @Body() createItemDto: CreateItemDto,
    @Res() res: Response,
  ) {
    try {
      const createItem = await this.itemService.update({
        _id: params.id,
        ...createItemDto,
      });
      res.status(201).json({
        status: 'success',
        data: createItem,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteItem(@Param() params: any, @Res() res: Response) {
    try {
      const createItem = await this.itemService.delete(params.id);
      res.status(201).json({
        status: 'success',
        data: createItem,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }
}
