import { describe, it, expect } from 'vitest';
import {
  addOrderToQueue,
  removeOrderFromQueue,
  findOrderById,
  updateOrderStatus,
} from '../../utils/queueManager';
import { createOrder } from '../../utils/orderUtils';
import type { Order } from '../../utils/types';

describe('queueManager', () => {
  describe('addOrderToQueue', () => {
    it('should add order to empty queue', () => {
      const order = createOrder(1, 'NORMAL');
      const queue = addOrderToQueue([], order);

      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe(1);
    });

    it('should add order and maintain priority ordering', () => {
      const normal1 = createOrder(1, 'NORMAL');
      const vip1 = createOrder(2, 'VIP');
      const normal2 = createOrder(3, 'NORMAL');

      let queue: Order[] = [];
      queue = addOrderToQueue(queue, normal1);
      queue = addOrderToQueue(queue, vip1);
      queue = addOrderToQueue(queue, normal2);

      expect(queue).toHaveLength(3);
      expect(queue[0].type).toBe('VIP'); // VIP first
      expect(queue[1].type).toBe('NORMAL'); // Then normals
      expect(queue[2].type).toBe('NORMAL');
    });

    it('should not mutate original queue', () => {
      const order = createOrder(1, 'NORMAL');
      const originalQueue: Order[] = [];
      const newQueue = addOrderToQueue(originalQueue, order);

      expect(originalQueue).toHaveLength(0);
      expect(newQueue).toHaveLength(1);
    });
  });

  describe('removeOrderFromQueue', () => {
    it('should remove order by ID', () => {
      const order1 = createOrder(1, 'NORMAL');
      const order2 = createOrder(2, 'VIP');
      const queue = [order1, order2];

      const newQueue = removeOrderFromQueue(queue, 1);

      expect(newQueue).toHaveLength(1);
      expect(newQueue[0].id).toBe(2);
    });

    it('should return same queue if order not found', () => {
      const order1 = createOrder(1, 'NORMAL');
      const queue = [order1];

      const newQueue = removeOrderFromQueue(queue, 999);

      expect(newQueue).toHaveLength(1);
      expect(newQueue[0].id).toBe(1);
    });

    it('should handle empty queue', () => {
      const newQueue = removeOrderFromQueue([], 1);
      expect(newQueue).toEqual([]);
    });

    it('should not mutate original queue', () => {
      const order1 = createOrder(1, 'NORMAL');
      const originalQueue = [order1];
      const newQueue = removeOrderFromQueue(originalQueue, 1);

      expect(originalQueue).toHaveLength(1);
      expect(newQueue).toHaveLength(0);
    });
  });

  describe('findOrderById', () => {
    it('should find order by ID', () => {
      const order1 = createOrder(1, 'NORMAL');
      const order2 = createOrder(2, 'VIP');
      const queue = [order1, order2];

      const found = findOrderById(queue, 2);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(2);
      expect(found?.type).toBe('VIP');
    });

    it('should return null if order not found', () => {
      const order1 = createOrder(1, 'NORMAL');
      const queue = [order1];

      const found = findOrderById(queue, 999);

      expect(found).toBeNull();
    });

    it('should return null for empty queue', () => {
      const found = findOrderById([], 1);
      expect(found).toBeNull();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', () => {
      const order1 = createOrder(1, 'NORMAL');
      const order2 = createOrder(2, 'VIP');
      const queue = [order1, order2];

      const newQueue = updateOrderStatus(queue, 1, 'processing');

      // Find the updated order
      const updatedOrder = newQueue.find((o) => o.id === 1);
      expect(updatedOrder?.status).toBe('processing');
    });

    it('should not modify other orders', () => {
      const order1 = createOrder(1, 'NORMAL');
      const order2 = createOrder(2, 'VIP');
      const queue = [order1, order2];

      const newQueue = updateOrderStatus(queue, 1, 'complete');

      const unchangedOrder = newQueue.find((o) => o.id === 2);
      expect(unchangedOrder?.status).toBe('pending');
    });

    it('should return same queue if order not found', () => {
      const order1 = createOrder(1, 'NORMAL');
      const queue = [order1];

      const newQueue = updateOrderStatus(queue, 999, 'complete');

      expect(newQueue).toHaveLength(1);
      expect(newQueue[0].status).toBe('pending');
    });

    it('should not mutate original queue', () => {
      const order1 = createOrder(1, 'NORMAL');
      const originalQueue = [order1];
      const newQueue = updateOrderStatus(originalQueue, 1, 'complete');

      expect(originalQueue[0].status).toBe('pending');
      expect(newQueue[0].status).toBe('complete');
    });
  });
});
