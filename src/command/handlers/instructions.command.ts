import { Auth, CommandContract } from '@shared/decorators';
import { IContext } from '@shared/types';
import { Update } from 'nestjs-telegraf';
import { checkPm } from '@shared/helpers';

@Update()
export class InstructionsCommand {
  @Auth()
  @CommandContract('commands.instructions')
  async getInstructions(ctx: IContext) {
    const { user } = ctx.session;

    if (ctx.chat.type !== 'private') {
      await checkPm(ctx);
    }

    await ctx.typedSendMessage('phrases', { chatId: user.chatId });
  }
}
