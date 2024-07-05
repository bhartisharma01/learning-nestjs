import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { ProfileDto } from './dtos/profile.dto';
import { User } from './entities/user.entity';
import { PostDto } from './dtos/post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/jwt-auth.guard';



const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    // const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${name}${extension}`);
  },
});

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post('login')
  // async loginUser(@Body() loginUserDto: UserDto) {
  //   return await this.userService.loginUser(loginUserDto);
  // }
  @Get('getuser')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUser() {
    return await this.userService.getUser();
  }

  @Get('getuserbyid/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  @Post('create-user')
  createUser(@Body() createUserDto: UserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put('updateuser/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete('deleteuser/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deteUser(id);
  }

  // Profile controller

  // @Post(':id/profile')
  // async createUserProfile(@Param('id', ParseIntPipe) id:number, @Body() createUserProfileDto:ProfileDto){
  //    return await this.userService.createUserProfile(id, createUserProfileDto)
  // }

  @Post(':id/profile')
  async createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProfileDto: ProfileDto,
  ): Promise<User> {
    return await this.userService.createUserProfile(id, createProfileDto);
  }

  // post
  @ApiTags('Posts')
  @Post(':id/post')
  async createPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: PostDto,
  ) {
    return await this.userService.createUserPost(id, createPostDto);
  }

  // file upload

 
  


    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    uploadFile(@UploadedFile() file) {
      console.log(file);
      return { message: 'File uploaded successfully!', filename: file.filename };
    }
  
  
}
