export const BOT_PROCESSING_TIME_MS = 10000; // 10 seconds

export const BotStatus = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
} as const;

export type BotStatus = typeof BotStatus[keyof typeof BotStatus];

export interface BotConfig {
  processingTimeMs: number;
}

export const DEFAULT_BOT_CONFIG: BotConfig = {
  processingTimeMs: BOT_PROCESSING_TIME_MS,
};
