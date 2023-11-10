import {
  ChangeLanguageScene,
  HomeScene,
  InstructionsCommand,
  RegAgeScene,
  RegWelcomeScene,
} from './handlers';
import { Module } from '@nestjs/common';
import { BotService } from '@bot.service';
import { UserService } from '@user';
import { PrismaService } from '@prisma';

@Module({
  providers: [
    RegWelcomeScene,
    RegAgeScene,
    ChangeLanguageScene,
    HomeScene,
    InstructionsCommand,
    BotService,
    UserService,
    PrismaService,
  ],
})
export class CommandModule {}
