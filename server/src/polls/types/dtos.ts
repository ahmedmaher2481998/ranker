import {
  IsNotEmpty,
  IsInt,
  Length,
  IsString,
  Max,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  topic: string;

  @IsNotEmpty()
  @IsInt()
  @Max(5)
  @Min(1)
  votesPerVoter: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  name: string;
}
export class JoinPollDto {
  @IsNotEmpty()
  @Length(6)
  @IsString()
  pollID: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  name: string;
}



export class AddNominationDTO {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  text: string
}

export class RemoveNominationDTO {
  @IsNotEmpty()
  @Length(8)
  id: string
}



