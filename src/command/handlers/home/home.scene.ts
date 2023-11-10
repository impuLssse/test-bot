import { Logger } from '@nestjs/common';
import { ActionContract, Auth, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/types';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.home')
export class HomeScene {
  @SceneEnter()
  async getEnter(ctx: IContext) {
    const { user, profile } = ctx.session;
    Logger.log(ctx.session);

    await ctx.replyOrEdit(profile ? 'phrases.home' : 'phrases.no-reg-home', {
      args: {
        username: ctx.from.username,
        firstName: profile?.firstName,
        age: profile?.age,
      },
      ...ctx.k.typedInlineKeyboard([['buttons.reg'], ['buttons.change_language']], ctx),
    });
  }

  @Auth()
  @ActionContract('buttons.change_language')
  async toChangeLanguage(ctx: IContext) {
    await ctx.scene.enter('scenes.change_language');
  }

  @Auth()
  @ActionContract('buttons.reg')
  async toReg(ctx: IContext) {
    await ctx.scene.enter('scenes.reg.welcome');
  }
}
