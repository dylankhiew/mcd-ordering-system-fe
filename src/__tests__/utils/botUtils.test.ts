import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateBotId,
  createBot,
  assignOrderToBot,
  resetBot,
  findIdleBot,
  getProcessingBots,
} from '../../utils/botUtils';
import { BotStatus } from '../../constants/botConfig';
import type { Bot } from '../../utils/types';

describe('botUtils', () => {
  describe('generateBotId', () => {
    it('should generate next ID based on current max', () => {
      expect(generateBotId(0)).toBe(1);
      expect(generateBotId(5)).toBe(6);
      expect(generateBotId(100)).toBe(101);
    });
  });

  describe('createBot', () => {
    it('should create a bot with correct initial properties', () => {
      const bot = createBot(1);

      expect(bot.id).toBe(1);
      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrderId).toBeNull();
      expect(bot.startTime).toBeNull();
    });
  });

  describe('assignOrderToBot', () => {
    let mockDateNow: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      mockDateNow = vi.spyOn(Date, 'now').mockReturnValue(5000);
    });

    afterEach(() => {
      mockDateNow.mockRestore();
    });

    it('should assign order to bot', () => {
      const bot = createBot(1);
      const updatedBot = assignOrderToBot(bot, 42);

      expect(updatedBot.status).toBe(BotStatus.PROCESSING);
      expect(updatedBot.currentOrderId).toBe(42);
      expect(updatedBot.startTime).toBe(5000);
    });

    it('should not mutate original bot', () => {
      const bot = createBot(1);
      const updatedBot = assignOrderToBot(bot, 42);

      expect(bot.status).toBe(BotStatus.IDLE);
      expect(bot.currentOrderId).toBeNull();
      expect(updatedBot.status).toBe(BotStatus.PROCESSING);
    });
  });

  describe('resetBot', () => {
    it('should reset bot to idle state', () => {
      const bot: Bot = {
        id: 1,
        status: BotStatus.PROCESSING,
        currentOrderId: 42,
        startTime: 5000,
      };

      const resetBotResult = resetBot(bot);

      expect(resetBotResult.id).toBe(1);
      expect(resetBotResult.status).toBe(BotStatus.IDLE);
      expect(resetBotResult.currentOrderId).toBeNull();
      expect(resetBotResult.startTime).toBeNull();
    });

    it('should not mutate original bot', () => {
      const bot: Bot = {
        id: 1,
        status: BotStatus.PROCESSING,
        currentOrderId: 42,
        startTime: 5000,
      };

      const resetBotResult = resetBot(bot);

      expect(bot.status).toBe(BotStatus.PROCESSING);
      expect(resetBotResult.status).toBe(BotStatus.IDLE);
    });
  });

  describe('findIdleBot', () => {
    it('should find first idle bot', () => {
      const bots: Bot[] = [
        { id: 1, status: BotStatus.PROCESSING, currentOrderId: 1, startTime: 1000 },
        { id: 2, status: BotStatus.IDLE, currentOrderId: null, startTime: null },
        { id: 3, status: BotStatus.IDLE, currentOrderId: null, startTime: null },
      ];

      const idleBot = findIdleBot(bots);

      expect(idleBot).not.toBeNull();
      expect(idleBot?.id).toBe(2);
    });

    it('should return null if no idle bots', () => {
      const bots: Bot[] = [
        { id: 1, status: BotStatus.PROCESSING, currentOrderId: 1, startTime: 1000 },
        { id: 2, status: BotStatus.PROCESSING, currentOrderId: 2, startTime: 2000 },
      ];

      const idleBot = findIdleBot(bots);

      expect(idleBot).toBeNull();
    });

    it('should return null for empty array', () => {
      const idleBot = findIdleBot([]);
      expect(idleBot).toBeNull();
    });
  });

  describe('getProcessingBots', () => {
    it('should return all processing bots', () => {
      const bots: Bot[] = [
        { id: 1, status: BotStatus.PROCESSING, currentOrderId: 1, startTime: 1000 },
        { id: 2, status: BotStatus.IDLE, currentOrderId: null, startTime: null },
        { id: 3, status: BotStatus.PROCESSING, currentOrderId: 2, startTime: 2000 },
      ];

      const processingBots = getProcessingBots(bots);

      expect(processingBots).toHaveLength(2);
      expect(processingBots[0].id).toBe(1);
      expect(processingBots[1].id).toBe(3);
    });

    it('should return empty array if no processing bots', () => {
      const bots: Bot[] = [
        { id: 1, status: BotStatus.IDLE, currentOrderId: null, startTime: null },
        { id: 2, status: BotStatus.IDLE, currentOrderId: null, startTime: null },
      ];

      const processingBots = getProcessingBots(bots);

      expect(processingBots).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      const processingBots = getProcessingBots([]);
      expect(processingBots).toEqual([]);
    });
  });
});
