import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { AuthModule } from './auth/auth.module';
// import { HashingService } from './helpers/hashing/hashing.service';
// import { UsersService } from './users/users.service';
// import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
// import { AuthService } from './auth/auth.service';
import { ItemsModule } from './items/items.module';

const dbcloud =
  'mongodb+srv://haris:ZoAaSVOltw4RBxG3@cluster0.r8pel.mongodb.net/?retryWrites=true&w=majority&appName=youapp';

@Module({
  imports: [
    MongooseModule.forRoot(dbcloud),
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
