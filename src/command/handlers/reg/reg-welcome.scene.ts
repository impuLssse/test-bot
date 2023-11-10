import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/types';
import { Hears, SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.reg.welcome')
export class RegWelcomeScene {
  @SceneEnter()
  async getEnter(ctx: IContext) {
    await ctx.replyOrEdit('phrases.reg.welcome', {
      ...ctx.k.typedInlineKeyboard(['buttons.back'], ctx),
    });
  }

  @Hears(/[^/]+/)
  async hearsFirstname(ctx: IContext) {
    const { text } = ctx.message;

    ctx.session.profile = {
      ...ctx.session.profile,
      firstName: text,
    };

    await ctx.scene.enter('scenes.reg.age');
  }

  @ActionContract('buttons.back')
  async back(ctx: IContext) {
    await ctx.scene.enter('scenes.home');
  }
}
