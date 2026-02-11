import type { BotStatus } from '../constants/botConfig';

export interface Order {
  id: number;
  type: string;
  priority: number;
  timestamp: number;
  status: 'pending' | 'processing' | 'complete';
}

export interface Bot {
  id: number;
  status: BotStatus;
  currentOrderId: number | null;
  startTime: number | null;
}
