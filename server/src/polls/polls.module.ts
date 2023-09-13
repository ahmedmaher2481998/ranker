import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { ConfigModule } from '@nestjs/config';
import { PollsService } from './polls.service';
import { PollsRepository } from './polls.repository';
import { jwtModule, redisModule } from '../config/modules.config';
import { PollsGateway } from './polls.gatway';
@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule { }
