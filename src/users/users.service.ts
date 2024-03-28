import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel
      .findById(new Types.ObjectId(id))
      .select({ password: 0 });
  }

  async findUsers() {
    return this.userModel.find().select({ password: 0 });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).select({ password: 0 });
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel
      .findOne({ username: username })
      .select({ password: 0 });
  }

  async findUserByEmailOrUsername(email: string) {
    return this.userModel.findOne({ $or: [{ email }, { username: email }] });
  }

  async updateProfile(createUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      {
        email: createUserDto.email,
        _id: new Types.ObjectId(createUserDto._id),
      },
      createUserDto,
    );
  }

  async updateRoleUser(createUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(createUserDto._id),
      },
      createUserDto,
    );
  }
}
