import { IsDateString, IsOptional, IsString } from 'class-validator';

export class HistoricalQueryDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  base?: string;
}
