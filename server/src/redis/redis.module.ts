import {
  DynamicModule,
  Module,
  FactoryProvider,
  ModuleMetadata,
} from '@nestjs/common';
import IoRedis, { RedisOptions, Redis } from 'ioredis';

export const IoRedisKey = 'IoRedis';
// The return of the useFactory Method
type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};
// the args for the registerAsync function
type RedisAsyncModuleOptions = {
  useFactory: (...args: any[]) => RedisModuleOptions;
} & Pick<FactoryProvider, 'inject'> &
  Pick<ModuleMetadata, 'imports'>;

@Module({})
export class RedisModule {
  static async registerAsync({
    imports,
    inject,
    useFactory: getConfig,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProviders = {
      provide: IoRedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await getConfig(...args);
        const redis = await new IoRedis(connectionOptions);
        onClientReady(redis);
        return redis;
      },
      inject,
    };

    return {
      module: RedisModule,
      imports,
      providers: [redisProviders],
      exports: [redisProviders],
    };
  }
}
