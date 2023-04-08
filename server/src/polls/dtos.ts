import {
  IsNotEmpty,
  IsInt,
  Length,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';
export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  topic: string;

  @IsNotEmpty()
  @IsInt()
  @Min(2)
  @Max(5)
  votesPerVoter: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  name: string;
}
export class JoinPollDto {
  @IsNotEmpty()
  @Length(6, 6)
  @IsString()
  pollId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  name: string;
}
