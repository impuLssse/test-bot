import { TranslateService } from '@translate';
import { I18nPath, IExtraTextOptions } from '@shared/types';
import { IContext } from '@shared/types';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { Extra } from '@core/extra';

export function replyOrEdit(this: Extra, ctx: IContext, translate: TranslateService) {
  return async (text: I18nPath, extra?: IExtraTextOptions) => {
    const phrase = translate.findPhrase(text, ctx.session.lang, extra.args);

    try {
      return (await ctx.editMessageText(phrase, {
        parse_mode: 'HTML',
        reply_markup: extra?.reply_markup as InlineKeyboardMarkup,
      })) as Message.TextMessage;
    } catch (e) {
      const msg = await this.baseTypedSendMessage(ctx, text, extra);
      ctx.session.messageId = msg?.message_id;
    }
  };
}
