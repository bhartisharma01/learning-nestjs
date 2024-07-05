import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createUserType } from 'src/utils/types/users.type';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { ProfileDto } from './dtos/profile.dto';
import { Profile } from './entities/profile.entity';
import { PostDto } from './dtos/post.dto';
import { Post } from './entities/post.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  // login

  async findUserName(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getUser(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.userRepository.find({
        relations: ['profile', 'posts'],
      });
      // console.log('fetched users ', users);
      return users.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );
    } catch (error) {
      console.log('error during fetching users ', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const userbyid = await this.userRepository.findOne({
        where: { id },
        relations: ['profile', 'posts'], // Include the related Profile data
      });

      return userbyid;
    } catch (error) {
      console.log('error while fetching by id ', error);
      return error;
    }
  }

  async createUser(createUserDto: UserDto) {
    try {
      const { email, username, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { username }],
      });
      if (existingUser) {
        if (existingUser.email === email)
          throw new ConflictException('Email already exists');
        else if (existingUser.username === username)
          throw new ConflictException('Username already exists');
      }

      createUserDto.password = hashedPassword;
      console.log('hashed password ', hashedPassword, createUserDto);
      const newUser = this.userRepository.create({
        ...createUserDto,
        createdAt: new Date(),
      });
      console.log('checking new user value after hashed ', newUser);
      return this.userRepository.save(newUser);
    } catch (error) {
      console.log('existing user ', error);
      throw error;
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updateUser = { ...user, ...updateUserDto };
      return this.userRepository.save(updateUser);
    } catch (error) {
      throw error;
    }
  }

  async deteUser(id: number): Promise<{ message: string; id: number }> {
    try {
      const findUser = await this.userRepository.findOneBy({ id });
      if (!findUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.userRepository.remove(findUser);
      return { message: `User deleted with ID ${id}`, id };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  // profile service

  async createUserProfile(
    id: number,
    createUserProfileDto: ProfileDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      console.log('checking user value ', user);
      if (!user) {
        throw new HttpException(
          'User not found. Can not create profile',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newProfile =
        this.userProfileRepository.create(createUserProfileDto);
      const savedProfile = await this.userProfileRepository.save(newProfile);
      user.profile = savedProfile;
      return this.userRepository.save(user);
    } catch (error) {
      console.log('error during creating profile ', error);
      throw error;
    }
  }

  async createUserPost(id: number, createPostDto: PostDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException(
          'User not found. Can not create profile',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newPosts = this.postRepository.create({ ...createPostDto, user });
      return this.postRepository.save(newPosts);
    } catch (error) {
      console.log('error during saving posts ', error);
      throw error;
    }
  }
}
