import type { Order } from './types';
import { sortOrdersByPriority } from './orderUtils';

/**
 * Adds an order to the queue in the correct position based on priority
 * @param queue - Current queue of orders
 * @param order - Order to add
 * @returns Updated queue with the new order
 */
export const addOrderToQueue = (queue: Order[], order: Order): Order[] => {
  const updatedQueue = [...queue, order];
  return sortOrdersByPriority(updatedQueue);
};

/**
 * Removes an order from the queue by ID
 * @param queue - Current queue of orders
 * @param orderId - ID of the order to remove
 * @returns Updated queue without the specified order
 */
export const removeOrderFromQueue = (queue: Order[], orderId: number): Order[] => {
  return queue.filter((order) => order.id !== orderId);
};

/**
 * Finds an order in the queue by ID
 * @param queue - Queue to search in
 * @param orderId - ID of the order to find
 * @returns The order if found, null otherwise
 */
export const findOrderById = (queue: Order[], orderId: number): Order | null => {
  return queue.find((order) => order.id === orderId) || null;
};

/**
 * Updates an order's status in the queue
 * @param queue - Current queue of orders
 * @param orderId - ID of the order to update
 * @param status - New status for the order
 * @returns Updated queue with the order status changed
 */
export const updateOrderStatus = (
  queue: Order[],
  orderId: number,
  status: Order['status']
): Order[] => {
  return queue.map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
};
