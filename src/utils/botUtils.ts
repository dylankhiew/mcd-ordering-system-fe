import type { Bot } from './types';
import { BotStatus } from '../constants/botConfig';

/**
 * Generates a unique bot ID
 * @param currentMaxId - The current maximum bot ID
 * @returns The next unique bot ID
 */
export const generateBotId = (currentMaxId: number): number => {
  return currentMaxId + 1;
};

/**
 * Creates a new bot object
 * @param id - Unique bot ID
 * @returns New bot object
 */
export const createBot = (id: number): Bot => {
  return {
    id,
    status: BotStatus.IDLE,
    currentOrderId: null,
    startTime: null,
  };
};

/**
 * Assigns an order to a bot
 * @param bot - Bot to assign the order to
 * @param orderId - ID of the order to assign
 * @returns Updated bot object
 */
export const assignOrderToBot = (bot: Bot, orderId: number): Bot => {
  return {
    ...bot,
    status: BotStatus.PROCESSING,
    currentOrderId: orderId,
    startTime: Date.now(),
  };
};

/**
 * Resets a bot to idle state
 * @param bot - Bot to reset
 * @returns Updated bot object
 */
export const resetBot = (bot: Bot): Bot => {
  return {
    ...bot,
    status: BotStatus.IDLE,
    currentOrderId: null,
    startTime: null,
  };
};

/**
 * Finds an idle bot
 * @param bots - Array of bots
 * @returns First idle bot or null if none available
 */
export const findIdleBot = (bots: Bot[]): Bot | null => {
  return bots.find((bot) => bot.status === BotStatus.IDLE) || null;
};

/**
 * Gets all bots currently processing orders
 * @param bots - Array of bots
 * @returns Array of bots in processing state
 */
export const getProcessingBots = (bots: Bot[]): Bot[] => {
  return bots.filter((bot) => bot.status === BotStatus.PROCESSING);
};
