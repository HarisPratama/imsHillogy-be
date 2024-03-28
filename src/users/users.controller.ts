import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiHeader({
  name: 'Authorization',
  description: 'Value is Bearer {{access_token}}',
})
@Controller('api')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('createProfile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async createProfile(
    @Body() updateUserDto: UpdateUserDto,
    // @UploadedFile()
    // profileImage: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ) {
    const payload = {
      //   profileImage: profileImage.buffer.toString(),
      ...updateUserDto,
      birthDate: new Date(updateUserDto.birthDate),
      ...req.user,
    };

    const updateProfile = await this.userService.updateProfile(payload);

    if (updateProfile.email)
      res.status(HttpStatus.CREATED).json({ status: 'Success', data: payload });
    else res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
  }

  @UseGuards(AuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const getUserProfile = await this.userService.findUserByEmailOrUsername(
        req.user.email ?? req.user.username,
      );

      if (getUserProfile.email) {
        res
          .status(HttpStatus.OK)
          .json({ status: 'Success', data: getUserProfile });
      } else {
        throw Error;
      }
    } catch {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Get('users')
  async getUsers(@Request() req, @Res() res: Response) {
    try {
      const getUsers = await this.userService.findUsers();
      res.status(HttpStatus.OK).json({ status: 'Success', data: getUsers });
    } catch {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    // @UploadedFile() profileImage: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ) {
    const payload = {
      //   profileImage: profileImage.buffer.toString(),
      ...updateUserDto,
      birthDate: new Date(updateUserDto.birthDate),
      ...req.user,
    };

    const updateProfile = await this.userService.updateProfile(payload);

    if (updateProfile.email)
      res.status(HttpStatus.CREATED).json({ status: 'Success', data: payload });
    else res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
  }

  @UseGuards(AuthGuard)
  @Put('users/:id')
  async updateRole(
    @Body() updateUserDto: { role: string },
    @Param() params: any,
    @Res() res: Response,
    @Request() req,
  ) {
    try {
      if (req.user.role == 'admin') {
        const finduser = await this.userService.findUserById(params.id);
        const { email, name, username, gender, birthDate } = finduser;
        const payload = {
          _id: params.id,
          email,
          name,
          username,
          gender,
          birthDate,
          role: updateUserDto.role,
        };

        const updateProfile = await this.userService.updateRoleUser(payload);

        if (updateProfile) {
          res
            .status(HttpStatus.CREATED)
            .json({ status: 'Success', data: payload });
        } else {
          throw 'User Not Found' + ' ' + params.id;
        }
      } else {
        throw 'You have no access';
      }
    } catch (error) {
      res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ status: 'Error', message: error });
    }
  }
}
