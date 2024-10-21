import { IsString, IsNotEmpty, IsNumber, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { SortOrder } from '../fixture/fixture.dto';
import { Transform } from 'class-transformer';

export class TeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

export class TeamIdDto {
    @IsMongoId()
    @IsNotEmpty()
    id!: string;
  }

  export class TeamSearchDto {
    @IsString()
    @IsOptional()
    name!: string;
  
    @IsString()
    @IsOptional()
    country!: string;

    @IsString()
    @IsOptional()
    sortBy!: string;

    @IsEnum(SortOrder)
    @IsOptional()
    order!: SortOrder;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    page!: number;
  
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit!: number;
  }
