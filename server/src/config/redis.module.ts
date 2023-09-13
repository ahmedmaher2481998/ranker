import {
  DynamicModule,
  Module,
  FactoryProvider,
  ModuleMetadata,
} from '@nestjs/common';
import IoRedis, { RedisOptions, Redis } from 'ioredis';

export const IoRedisKey = 'IORedis';
// The return of the useFactory Method , we skipped that 
// type RedisModuleOptions = {
//   connectionOptions: RedisOptions;
//   onClientReady?: (client: Redis) => void;
// };
// the args for the registerAsync function
type RedisAsyncModuleOptions = {
  useFactory: (...args: any[]) => ({
    connectionOptions: RedisOptions;
    onClientReady?: (client: Redis) => void;
  });
} & Pick<FactoryProvider, 'inject'> &
  Pick<ModuleMetadata, 'imports'>;

@Module({})
export class RedisModule {
  // Registering the redis module with host And port and callback function 
  static async registerAsync({
    imports,
    inject,
    useFactory: getConfig,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProviders = {
      provide: IoRedisKey,
      useFactory: async (...args) => {
        // creates a logger & return the config off the redis client with on ready function  
        const { connectionOptions, onClientReady } = await getConfig(...args);
        // uses the client config passed from the getConfig to create the redis client
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
