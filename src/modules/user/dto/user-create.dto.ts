import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../decorators/transforms.decorator';

export class UserCreateDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  identityNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  isActive: boolean;

  password: string;
}
