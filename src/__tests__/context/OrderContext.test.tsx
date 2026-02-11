import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { OrderProvider, useOrderContext } from '../../context/OrderContext';
import type { ThemeMode } from '../../constants/theme';
import { BotStatus } from '../../constants/botConfig';
import React from 'react';

// Helper to create a wrapper for renderHook
const createWrapper = (initialTheme?: ThemeMode) => {
  return ({ children }: { children: React.ReactNode }) => (
    <OrderProvider initialTheme={initialTheme}>{children}</OrderProvider>
  );
};

describe('OrderContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty orders and no bots', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.pendingOrders).toEqual([]);
      expect(result.current.completeOrders).toEqual([]);
      expect(result.current.bots).toEqual([]);
    });

    it('should initialize with light theme by default', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.theme).toBe('light');
    });

    it('should initialize with custom theme', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper('dark'),
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('addOrder', () => {
    it('should add a NORMAL order to pending queue', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
      });

      expect(result.current.pendingOrders).toHaveLength(1);
      expect(result.current.pendingOrders[0].type).toBe('NORMAL');
      expect(result.current.pendingOrders[0].id).toBe(1);
      expect(result.current.pendingOrders[0].status).toBe('pending');
    });

    it('should add a VIP order to pending queue', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('VIP');
      });

      expect(result.current.pendingOrders).toHaveLength(1);
      expect(result.current.pendingOrders[0].type).toBe('VIP');
      expect(result.current.pendingOrders[0].priority).toBe(2);
    });

    it('should add multiple orders with unique IDs', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addOrder('VIP');
      });
      act(() => {
        result.current.addOrder('NORMAL');
      });

      expect(result.current.pendingOrders).toHaveLength(3);
      expect(result.current.pendingOrders[0].id).toBe(2); // VIP (priority)
      expect(result.current.pendingOrders[1].id).toBe(1); // First NORMAL
      expect(result.current.pendingOrders[2].id).toBe(3); // Second NORMAL
    });

    it('should maintain priority order when adding orders', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
        result.current.addOrder('VIP');
        result.current.addOrder('VVIP');
        result.current.addOrder('NORMAL');
      });

      expect(result.current.pendingOrders).toHaveLength(4);
      expect(result.current.pendingOrders[0].type).toBe('VVIP');
      expect(result.current.pendingOrders[1].type).toBe('VIP');
      expect(result.current.pendingOrders[2].type).toBe('NORMAL');
      expect(result.current.pendingOrders[3].type).toBe('NORMAL');
    });
  });

  describe('addBot', () => {
    it('should add a bot with unique ID', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addBot();
      });

      expect(result.current.bots).toHaveLength(1);
      expect(result.current.bots[0].id).toBe(1);
      expect(result.current.bots[0].status).toBe(BotStatus.IDLE);
    });

    it('should add multiple bots with incremental IDs', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addBot();
      });
      act(() => {
        result.current.addBot();
      });
      act(() => {
        result.current.addBot();
      });

      expect(result.current.bots).toHaveLength(3);
      expect(result.current.bots[0].id).toBe(1);
      expect(result.current.bots[1].id).toBe(2);
      expect(result.current.bots[2].id).toBe(3);
    });
  });

  describe('removeBot', () => {
    it('should remove the newest bot when idle', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addBot();
      });
      act(() => {
        result.current.addBot();
      });
      act(() => {
        result.current.addBot();
      });

      expect(result.current.bots).toHaveLength(3);

      act(() => {
        result.current.removeBot();
      });

      expect(result.current.bots).toHaveLength(2);
      expect(result.current.bots[0].id).toBe(1);
      expect(result.current.bots[1].id).toBe(2);
    });

    it('should do nothing when no bots exist', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.removeBot();
      });

      expect(result.current.bots).toEqual([]);
    });

    it('should return processing order to pending when bot is removed', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      // Add order and bot
      act(() => {
        result.current.addOrder('VIP');
        result.current.addBot();
      });

      // Wait for bot to pick up order
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.bots[0].status).toBe(BotStatus.PROCESSING);
      expect(result.current.pendingOrders).toHaveLength(0);

      // Remove the bot
      act(() => {
        result.current.removeBot();
      });

      // Order should be back in pending
      expect(result.current.bots).toHaveLength(0);
      expect(result.current.pendingOrders).toHaveLength(1);
      expect(result.current.pendingOrders[0].id).toBe(1);
      expect(result.current.pendingOrders[0].status).toBe('pending');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper('light'),
      });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper('dark'),
      });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.toggleTheme(); // DARK
        result.current.toggleTheme(); // LIGHT
        result.current.toggleTheme(); // DARK
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Bot Processing', () => {
    it('should process order when bot is added', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
        result.current.addBot();
      });

      // Bot should pick up order immediately
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.bots[0].status).toBe(BotStatus.PROCESSING);
      expect(result.current.bots[0].currentOrderId).toBe(1);
      expect(result.current.pendingOrders).toHaveLength(0);

      // After 10 seconds, order should be complete
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(result.current.bots[0].status).toBe(BotStatus.IDLE);
      expect(result.current.bots[0].currentOrderId).toBeNull();
      expect(result.current.completeOrders).toHaveLength(1);
      expect(result.current.completeOrders[0].id).toBe(1);
      expect(result.current.completeOrders[0].status).toBe('complete');
    });

    it('should process orders in priority order (VIP before NORMAL)', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addOrder('VIP');
      });
      act(() => {
        result.current.addBot();
      });

      // Bot should pick up VIP order (id: 2) first (higher priority)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      // VIP order should be picked up first
      const processingVIP = result.current.processingOrders.find(o => o.type === 'VIP');
      expect(processingVIP).toBeDefined();
      expect(result.current.bots[0].currentOrderId).toBe(processingVIP?.id);
      expect(result.current.pendingOrders).toHaveLength(1);
      expect(result.current.pendingOrders[0].type).toBe('NORMAL');
    });

    it('should process multiple orders sequentially with one bot', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addBot();
      });

      // First order is picked up
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.bots[0].currentOrderId).toBe(1);
      expect(result.current.pendingOrders).toHaveLength(1);

      // Complete first order
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(result.current.completeOrders).toHaveLength(1);
      // Bot should pick up second order
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(result.current.bots[0].status).toBe(BotStatus.PROCESSING);
      expect(result.current.bots[0].currentOrderId).toBe(2);

      // Complete second order
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(result.current.completeOrders).toHaveLength(2);
      expect(result.current.bots[0].status).toBe(BotStatus.IDLE);
      expect(result.current.pendingOrders).toHaveLength(0);
    });

    it('should process orders in parallel with multiple bots', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addOrder('NORMAL');
      });
      act(() => {
        result.current.addBot();
      });
      act(() => {
        result.current.addBot();
      });

      // Both bots should pick up orders
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.bots[0].status).toBe(BotStatus.PROCESSING);
      expect(result.current.bots[1].status).toBe(BotStatus.PROCESSING);
      expect(result.current.pendingOrders).toHaveLength(0);

      // Both orders complete
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(result.current.completeOrders.length).toBeGreaterThanOrEqual(2);
      expect(result.current.bots[0].status).toBe(BotStatus.IDLE);
      expect(result.current.bots[1].status).toBe(BotStatus.IDLE);
    });

    it('should handle VVIP, VIP, and NORMAL priority correctly', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL'); // id: 1
      });
      act(() => {
        result.current.addOrder('VIP');    // id: 2
      });
      act(() => {
        result.current.addOrder('NORMAL'); // id: 3
      });
      act(() => {
        result.current.addOrder('VVIP');   // id: 4
      });
      act(() => {
        result.current.addOrder('VIP');    // id: 5
      });
      act(() => {
        result.current.addBot();
      });

      // Should process VVIP first
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      const vvipOrder = result.current.processingOrders.find(o => o.type === 'VVIP');
      expect(vvipOrder).toBeDefined();
      expect(result.current.bots[0].currentOrderId).toBe(vvipOrder?.id);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // Then first VIP (id: 2, older than id: 5)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(result.current.bots[0].currentOrderId).toBe(2);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // Then second VIP (id: 5)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(result.current.bots[0].currentOrderId).toBe(5);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // Then first NORMAL (id: 1)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(result.current.bots[0].currentOrderId).toBe(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // Finally second NORMAL (id: 3)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(result.current.bots[0].currentOrderId).toBe(3);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      expect(result.current.completeOrders).toHaveLength(5);
      expect(result.current.bots[0].status).toBe(BotStatus.IDLE);
    });

    it('should handle new order added while bot is processing', async () => {
      const { result } = renderHook(() => useOrderContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addOrder('NORMAL');
        result.current.addBot();
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      // Bot is processing first order
      expect(result.current.bots[0].status).toBe(BotStatus.PROCESSING);

      // Add a VIP order mid-processing
      act(() => {
        result.current.addOrder('VIP');
      });

      expect(result.current.pendingOrders).toHaveLength(1);
      expect(result.current.pendingOrders[0].type).toBe('VIP');

      // First order completes
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000);
      });

      // VIP order should be picked up next
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.bots[0].currentOrderId).toBe(2); // VIP
    });
  });

  describe('useOrderContext hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useOrderContext());
      }).toThrow('useOrderContext must be used within an OrderProvider');

      consoleSpy.mockRestore();
    });
  });
});
