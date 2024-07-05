import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Post } from './entities/post.entity';



@Module({
  imports:[TypeOrmModule.forFeature([User, Profile,Post])],
  controllers: [UserController],
  providers:[UserService],
  exports:[UserService]
})
export class UserModule {}
