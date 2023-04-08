import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { ConfigModule } from '@nestjs/config';
import { PollsService } from './polls.service';
@Module({
  imports: [ConfigModule],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
