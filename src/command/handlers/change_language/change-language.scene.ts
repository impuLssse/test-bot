import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, Langs } from '@shared/types';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.change_language')
export class ChangeLanguageScene {
  @SceneEnter()
  async getEnter(ctx: IContext) {
    await ctx.replyOrEdit('phrases.select_language', {
      ...ctx.k.typedInlineKeyboard([['languages.en', 'languages.ru', 'buttons.back']], ctx, {
        flat: true,
        columns: 1,
      }),
    });
  }

  @ActionContract('buttons.back')
  async back(ctx: IContext) {
    await ctx.scene.enter('scenes.home');
  }

  @ActionContract(/languages./)
  async determineLanguage(ctx: IContext) {
    const { data } = ctx.callbackQuery;

    const language = data.split('.')[1] as Langs;

    ctx.session.lang = language;
    await ctx.scene.enter('scenes.change_language');
  }
}
