import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    /// Configration setup
    ConfigModule.forRoot({
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        MONGODB_URI: Joi.string().required(),
        GRAPHQL_PLAYGROUND: Joi.boolean().required(),
        AT_SECRET: Joi.string().required(),
        RT_SECRET: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().default(3001),
        REDIS_PASSWORD: Joi.string().required(),
      })
    }),

    /// Graphql setup
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.getOrThrow<boolean>('GRAPHQL_PLAYGROUND'),
        introspection: configService.getOrThrow<string>('NODE_ENV') !== 'production',
        context: ({ req, res }) => ({ req, res }),
        csrfPrevention: true,
        subscriptions: {
          'subscriptions-transport-ws': true,
          'graphql-ws': true
        }
      }),
      imports: [],
      inject: [ConfigService],
    }),

    /// Logger setUp
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.getOrThrow('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            // we will remove pino-pretty in production since it might slow down the app
            transport: isProduction
              ? undefined
              : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
            // debug might be too verbose for production
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),

    RedisModule,
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
