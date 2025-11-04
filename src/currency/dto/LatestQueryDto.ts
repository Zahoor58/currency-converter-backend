import { IsOptional, IsString, Length } from 'class-validator';

export class LatestQueryDto {
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  base?: string;
}
