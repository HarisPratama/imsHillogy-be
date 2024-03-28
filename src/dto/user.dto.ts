import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Not required' })
  _id?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  birthDate?: Date;
}

export class FindUserDto {
  name: string;
  email: string;
}
