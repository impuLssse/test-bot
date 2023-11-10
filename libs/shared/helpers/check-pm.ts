import { IContext } from '../types';

export const checkPm = async (ctx: IContext): Promise<void> => {
  await ctx.typedSendMessage('phrases.check_pm');
};
