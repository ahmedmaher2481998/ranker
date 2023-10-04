import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './types/dtos';
import { PollsService } from './polls.service';
import { ControllerAuthGuard } from './guards/auth-controller.guard';
import { RequestWithAuth } from './types/types';

@Controller('polls')
@UsePipes(new ValidationPipe())
export class PollsController {
  constructor(private readonly pollService: PollsService) { }

  @Post('/')
  async create(@Body() createPoll: CreatePollDto) {
    return await this.pollService.create(createPoll);
  }


  @Post('/join')
  async joinPoll(@Body() joinPoll: JoinPollDto) {
    console.log(`joining poll with id  ${joinPoll.pollID}`);
    return this.pollService.join(joinPoll);
  }

  @UseGuards(ControllerAuthGuard)
  @Post('rejoin')
  async rejoin(req: RequestWithAuth) {
    const { name, userID, pollID } = req
    return this.pollService.rejoin({ name, userID, pollID });
  }
}
