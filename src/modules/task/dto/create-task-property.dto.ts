import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskPropertyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  filedName: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  isRequired: true;
}
