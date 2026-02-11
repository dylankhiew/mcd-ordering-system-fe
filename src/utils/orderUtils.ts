import type { Order } from './types';
import { ORDER_TYPES } from '../constants/orderTypes';

/**
 * Generates a unique order ID
 * @param currentMaxId - The current maximum order ID
 * @returns The next unique order ID
 */
export const generateOrderId = (currentMaxId: number): number => {
  return currentMaxId + 1;
};

/**
 * Creates a new order object
 * @param id - Unique order ID
 * @param type - Order type (NORMAL, VIP, VVIP, etc.)
 * @returns New order object
 */
export const createOrder = (id: number, type: string): Order => {
  const orderType = ORDER_TYPES[type];
  if (!orderType) {
    throw new Error(`Invalid order type: ${type}`);
  }

  return {
    id,
    type,
    priority: orderType.priority,
    timestamp: Date.now(),
    status: 'pending',
  };
};

/**
 * Sorts orders by priority (descending) then by timestamp (ascending)
 * Higher priority orders come first, and within the same priority,
 * older orders come first (FIFO)
 * @param orders - Array of orders to sort
 * @returns Sorted array of orders
 */
export const sortOrdersByPriority = (orders: Order[]): Order[] => {
  return [...orders].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    return a.timestamp - b.timestamp; // Older orders first (FIFO within same priority)
  });
};

/**
 * Gets the next order to process from the queue
 * @param orders - Array of pending orders
 * @returns The next order to process or null if queue is empty
 */
export const getNextOrder = (orders: Order[]): Order | null => {
  const sortedOrders = sortOrdersByPriority(orders);
  return sortedOrders.length > 0 ? sortedOrders[0] : null;
};
