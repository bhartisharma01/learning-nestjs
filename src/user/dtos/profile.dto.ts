import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ProfileDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactno: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dob: string;

    @ApiProperty()
    @IsString()
@IsOptional()
    profilePic:string
 }