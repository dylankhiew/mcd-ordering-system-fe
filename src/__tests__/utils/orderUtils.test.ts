import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateOrderId,
  createOrder,
  sortOrdersByPriority,
  getNextOrder,
} from '../../utils/orderUtils';
import type { Order } from '../../utils/types';

describe('orderUtils', () => {
  describe('generateOrderId', () => {
    it('should generate next ID based on current max', () => {
      expect(generateOrderId(0)).toBe(1);
      expect(generateOrderId(5)).toBe(6);
      expect(generateOrderId(100)).toBe(101);
    });
  });

  describe('createOrder', () => {
    it('should create a NORMAL order with correct properties', () => {
      const order = createOrder(1, 'NORMAL');
      expect(order.id).toBe(1);
      expect(order.type).toBe('NORMAL');
      expect(order.priority).toBe(1);
      expect(order.status).toBe('pending');
      expect(order.timestamp).toBeGreaterThan(0);
    });

    it('should create a VIP order with higher priority', () => {
      const order = createOrder(2, 'VIP');
      expect(order.id).toBe(2);
      expect(order.type).toBe('VIP');
      expect(order.priority).toBe(2);
      expect(order.status).toBe('pending');
    });

    it('should create a VVIP order with highest priority', () => {
      const order = createOrder(3, 'VVIP');
      expect(order.id).toBe(3);
      expect(order.type).toBe('VVIP');
      expect(order.priority).toBe(3);
      expect(order.status).toBe('pending');
    });

    it('should throw error for invalid order type', () => {
      expect(() => createOrder(1, 'INVALID')).toThrow('Invalid order type: INVALID');
    });
  });

  describe('sortOrdersByPriority', () => {
    let mockDateNow: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      mockDateNow = vi.spyOn(Date, 'now');
    });

    afterEach(() => {
      mockDateNow.mockRestore();
    });

    it('should sort orders by priority (higher priority first)', () => {
      mockDateNow.mockReturnValue(1000);
      const normalOrder = createOrder(1, 'NORMAL');
      
      mockDateNow.mockReturnValue(2000);
      const vipOrder = createOrder(2, 'VIP');
      
      mockDateNow.mockReturnValue(3000);
      const vvipOrder = createOrder(3, 'VVIP');

      const orders = [normalOrder, vipOrder, vvipOrder];
      const sorted = sortOrdersByPriority(orders);

      expect(sorted[0].id).toBe(3); // VVIP
      expect(sorted[1].id).toBe(2); // VIP
      expect(sorted[2].id).toBe(1); // NORMAL
    });

    it('should sort orders by timestamp within same priority (FIFO)', () => {
      mockDateNow.mockReturnValue(1000);
      const vip1 = createOrder(1, 'VIP');
      
      mockDateNow.mockReturnValue(2000);
      const vip2 = createOrder(2, 'VIP');
      
      mockDateNow.mockReturnValue(3000);
      const vip3 = createOrder(3, 'VIP');

      const orders = [vip3, vip1, vip2];
      const sorted = sortOrdersByPriority(orders);

      expect(sorted[0].id).toBe(1); // Oldest VIP
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3); // Newest VIP
    });

    it('should handle mixed priorities and timestamps correctly', () => {
      mockDateNow.mockReturnValue(1000);
      const normal1 = createOrder(1, 'NORMAL');
      
      mockDateNow.mockReturnValue(2000);
      const vip1 = createOrder(2, 'VIP');
      
      mockDateNow.mockReturnValue(3000);
      const normal2 = createOrder(3, 'NORMAL');
      
      mockDateNow.mockReturnValue(4000);
      const vip2 = createOrder(4, 'VIP');
      
      mockDateNow.mockReturnValue(5000);
      const vvip1 = createOrder(5, 'VVIP');

      const orders = [normal1, vip1, normal2, vip2, vvip1];
      const sorted = sortOrdersByPriority(orders);

      expect(sorted[0].id).toBe(5); // VVIP
      expect(sorted[1].id).toBe(2); // VIP (older)
      expect(sorted[2].id).toBe(4); // VIP (newer)
      expect(sorted[3].id).toBe(1); // NORMAL (older)
      expect(sorted[4].id).toBe(3); // NORMAL (newer)
    });

    it('should not mutate original array', () => {
      const orders: Order[] = [
        createOrder(1, 'NORMAL'),
        createOrder(2, 'VIP'),
      ];
      const originalLength = orders.length;
      const originalFirstId = orders[0].id;

      sortOrdersByPriority(orders);

      expect(orders.length).toBe(originalLength);
      expect(orders[0].id).toBe(originalFirstId);
    });

    it('should handle empty array', () => {
      const sorted = sortOrdersByPriority([]);
      expect(sorted).toEqual([]);
    });
  });

  describe('getNextOrder', () => {
    it('should return the highest priority order', () => {
      const orders: Order[] = [
        createOrder(1, 'NORMAL'),
        createOrder(2, 'VIP'),
        createOrder(3, 'NORMAL'),
      ];

      const next = getNextOrder(orders);
      expect(next?.id).toBe(2); // VIP order
    });

    it('should return oldest order when priorities are equal', () => {
      const orders: Order[] = [
        { ...createOrder(1, 'NORMAL'), timestamp: 3000 },
        { ...createOrder(2, 'NORMAL'), timestamp: 1000 },
        { ...createOrder(3, 'NORMAL'), timestamp: 2000 },
      ];

      const next = getNextOrder(orders);
      expect(next?.id).toBe(2); // Oldest timestamp
    });

    it('should return null for empty queue', () => {
      const next = getNextOrder([]);
      expect(next).toBeNull();
    });
  });
});
