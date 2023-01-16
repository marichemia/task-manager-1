import { PageOptionDto } from '../../../common/dtos/page-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectPageOptionsDto extends PageOptionDto {
  @ApiPropertyOptional()
  regionId: string;

  @ApiPropertyOptional()
  countryId: string;

  @ApiPropertyOptional()
  cityId: string;
}
