import { Module, NotFoundException } from '@nestjs/common';
import { PrismaModule, PrismaService } from '@prisma';
import { BotUpdate } from '@bot.update';
import { BotService } from '@bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MySQL } from '@telegraf/session/mysql';
import { session } from 'telegraf';
import { BotContract } from '@libs/contracts';
import { TranslateModule } from '@translate';
import { UserModule } from '@user';
import { UserService } from '@user';
import { Extra } from '@core';
import { TranslateService } from '@translate';
import { CommandModule } from './command/command.module';

const store = (config: ConfigService) => {
  return MySQL({
    host: config.get<string>('DATABASE_HOST'),
    user: config.get<string>('DATABASE_USER'),
    database: config.get<string>('DATABASE_NAME'),
    password: config.get<string>('DATABASE_PASS'),
    port: config.get<number>('DATABASE_PORT'),
  });
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TranslateModule,
    UserModule,
    TelegrafModule.forRootAsync({
      botName: BotContract.botName,
      imports: [ConfigModule, TranslateModule],
      inject: [ConfigService, TranslateService],
      useFactory: (config: ConfigService, translate: TranslateService) => {
        const token: string | null =
          process.env.NODE_ENV == 'dev'
            ? config.get('DEV_BOT_TOKEN')
            : process.env.NODE_ENV == 'prod'
            ? config.get('PROD_BOT_TOKEN')
            : null;

        if (!token) {
          throw new NotFoundException(`Token .env is not found`);
        }

        if (!config || !translate) {
          throw new NotFoundException(`Dependency is not provided`);
        }

        return {
          token,
          launchOptions: {
            dropPendingUpdates: true,
          },
          middlewares: [session({ store: store(config) }), ...new Extra(translate).middlewares],
        };
      },
    }),
    CommandModule,
  ],
  providers: [BotUpdate, BotService, UserService, PrismaService],
})
export class BotModule {}
