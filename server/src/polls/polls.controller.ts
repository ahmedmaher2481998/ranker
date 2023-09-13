import { Body, Controller, Post } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';
import { PollsService } from './polls.service';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollService: PollsService) { }

  @Post('/')
  async create(@Body() createPoll: CreatePollDto) {
    return await this.pollService.create(createPoll);
  }

  @Post('/join')
  async joinPoll(@Body() joinPoll: JoinPollDto) {
    return this.pollService.join(joinPoll);
  }
  @Post('rejoin')
  async rejoin() {
    const rejoin = {
      name: 'from jwt',
      userID: 'from jwt',
      pollID: 'from jwt',
    };
    return this.pollService.rejoin(rejoin);
  }
}
