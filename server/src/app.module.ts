import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsModule } from './polls/polls.module';
import { redisModule } from './redis/modules.config';

@Module({
  imports: [ConfigModule.forRoot(), redisModule, PollsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
