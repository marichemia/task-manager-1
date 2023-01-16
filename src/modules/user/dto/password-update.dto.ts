import { ApiProperty } from '@nestjs/swagger';

export class PasswordUpdateDto {
  @ApiProperty()
  readonly oldPassword: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly checkPassword: string;

  userId: number;
}
