import { BotService } from '@bot.service';
import { ActionContract } from '@shared/decorators';
import { Logger } from '@nestjs/common';
import { Auth, CommandContract } from '@shared/decorators';
import { IContext } from '@shared/types';
import { Start, Update } from 'nestjs-telegraf';

@Update()
export class BotUpdate {
  constructor(private botService: BotService) {}

  @Auth({ resetBotSession: true })
  @Start()
  @CommandContract('commands.start')
  async sayHello(ctx: IContext) {
    const { botService } = this;

    await ctx.scene.leave();
    await botService.setMyCommads(ctx);

    Logger.verbose(ctx.session, `SESSION - START`);

    await ctx.scene.enter('scenes.home');
  }
}
