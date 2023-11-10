import { Logger } from '@nestjs/common';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/types';
import { Hears, SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.reg.age')
export class RegAgeScene {
  @SceneEnter()
  async getEnter(ctx: IContext) {
    Logger.log(ctx.session);

    await ctx.replyOrEdit('phrases.reg.age', {
      ...ctx.k.typedInlineKeyboard(['buttons.back'], ctx),
    });
  }

  @Hears(/\d/)
  async hearsFirstname(ctx: IContext) {
    const { text } = ctx.message;

    const age = Number(text);
    if (!age || age < 0 || age > 50) {
      await ctx.typedSendMessage('phrases.set-normal-age', { reply: true });
      return;
    }

    ctx.session.profile.age = age;
    await ctx.scene.enter('scenes.home');
  }

  @ActionContract('buttons.back')
  async back(ctx: IContext) {
    ctx.session.profile.firstName = undefined;
    await ctx.scene.enter('scenes.reg.welcome');
  }
}
