import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsEnum, IsMongoId } from 'class-validator';

// Enum for fixture status
export enum FixtureStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}


export class CreateFixtureDto {
  @IsString()
  @IsNotEmpty()
  homeTeam!: string;

  @IsString()
  @IsNotEmpty()
  awayTeam!: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date!: Date;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsEnum(FixtureStatus)
  @IsOptional()
  status?: FixtureStatus; 
}

export class FixtureIdDto {
    @IsMongoId()
    @IsNotEmpty()
    id!: string;
  }


export class FixtureSearchDto {
    @IsString()
    @IsOptional()
    homeTeamName!: string;
  
    @IsString()
    @IsOptional()
    awayTeamName!: string;

    @IsEnum(FixtureStatus)
    @IsOptional()
    status?: FixtureStatus
  
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    startDate?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    endDate?: Date;

    @IsString()
    @IsOptional()
    sortBy?: string;

    @IsEnum(SortOrder)
    @IsOptional()
    order?: SortOrder;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    page?: number;
  
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    limit?: number;
}


export class UpdateFixtureDto {
    @IsString()
    @IsNotEmpty()
    homeTeam!: string;
  
    @IsString()
    @IsNotEmpty()
    awayTeam!: string;
  
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    date!: Date;
  
    @IsString()
    @IsNotEmpty()
    location!: string;
  
    @IsEnum(FixtureStatus)
    @IsOptional()
    status?: FixtureStatus;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    homeTeamScore?: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    awayTeamScore?: number;

  }
