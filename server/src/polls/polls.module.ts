import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { ConfigModule } from '@nestjs/config';
import { PollsService } from './polls.service';
import { PollsRepository } from './polls.repository';
import { redisModule } from '../redis/modules.config';
@Module({
  imports: [ConfigModule, redisModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}
