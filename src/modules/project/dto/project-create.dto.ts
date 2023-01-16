import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;
}
