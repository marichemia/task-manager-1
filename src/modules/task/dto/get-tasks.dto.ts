import { ApiProperty } from "@nestjs/swagger";

export class GetTasksDto{

  @ApiProperty()
  boardId: number;
}


