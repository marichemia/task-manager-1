import { ApiProperty } from "@nestjs/swagger";

export class ProjectDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;
}
