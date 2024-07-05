import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';


const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const emailOptions = { allow_display_name: false };
export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Username must have at least 2 characters.' })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail(emailOptions, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty()
  createdAt:Date

  
}
