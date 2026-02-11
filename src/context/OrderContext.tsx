import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { Order, Bot } from '../utils/types';
import {
  generateOrderId,
  createOrder,
  getNextOrder,
} from '../utils/orderUtils';
import {
  addOrderToQueue,
  removeOrderFromQueue,
} from '../utils/queueManager';
import {
  generateBotId,
  createBot,
  assignOrderToBot,
  resetBot,
  findIdleBot,
} from '../utils/botUtils';
import { BOT_PROCESSING_TIME_MS } from '../constants/botConfig';
import type { ThemeMode } from '../constants/theme';

interface OrderContextValue {
  // State
  pendingOrders: Order[];
  completeOrders: Order[];
  processingOrders: Order[];
  bots: Bot[];
  theme: ThemeMode;
  
  // Actions
  addOrder: (type: string) => void;
  addBot: () => void;
  removeBot: () => void;
  toggleTheme: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [processingOrders, setProcessingOrders] = useState<Order[]>([]);
  const [completeOrders, setCompleteOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [orderIdCounter, setOrderIdCounter] = useState(0);
  const [botIdCounter, setBotIdCounter] = useState(0);

  // Track active timers for each bot
  const botTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  /**
   * Adds a new order to the pending queue
   */
  const addOrder = useCallback((type: string) => {
    const newOrderId = generateOrderId(orderIdCounter);
    const newOrder = createOrder(newOrderId, type);
    
    setOrderIdCounter(newOrderId);
    setPendingOrders((prev) => addOrderToQueue(prev, newOrder));
  }, [orderIdCounter]);

  /**
   * Adds a new bot to the system
   */
  const addBot = useCallback(() => {
    const newBotId = generateBotId(botIdCounter);
    const newBot = createBot(newBotId);
    
    setBotIdCounter(newBotId);
    setBots((prev) => [...prev, newBot]);
  }, [botIdCounter]);

  /**
   * Removes the newest bot from the system
   * If the bot is processing an order, the order returns to pending
   */
  const removeBot = useCallback(() => {
    setBots((prevBots) => {
      if (prevBots.length === 0) return prevBots;

      // Get the newest bot (last in array)
      const newestBot = prevBots[prevBots.length - 1];
      
      // Clear any active timer for this bot
      const timer = botTimersRef.current.get(newestBot.id);
      if (timer) {
        clearTimeout(timer);
        botTimersRef.current.delete(newestBot.id);
      }

      // If bot was processing an order, return it to pending
      if (newestBot.currentOrderId !== null) {
        setProcessingOrders((prevProcessing) => {
          const processingOrder = prevProcessing.find(
            (order) => order.id === newestBot.currentOrderId
          );
          
          if (processingOrder) {
            // Remove from processing
            const updatedProcessing = prevProcessing.filter(
              (order) => order.id !== newestBot.currentOrderId
            );
            
            // Add back to pending
            const orderToReturn = { ...processingOrder, status: 'pending' as const };
            setPendingOrders((prevPending) => addOrderToQueue(prevPending, orderToReturn));
            
            return updatedProcessing;
          }
          
          return prevProcessing;
        });
      }

      // Remove the bot
      return prevBots.slice(0, -1);
    });
  }, []);

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) =>
      prev === 'light' ? 'dark' : 'light'
    );
  }, []);

  /**
   * Processes orders with idle bots
   * This effect runs whenever pending orders or bots change
   */
  useEffect(() => {
    const processNextOrder = () => {
      const idleBot = findIdleBot(bots);
      const nextOrder = getNextOrder(pendingOrders);

      if (idleBot && nextOrder) {
        // Assign order to bot
        setBots((prevBots) =>
          prevBots.map((bot) =>
            bot.id === idleBot.id ? assignOrderToBot(bot, nextOrder.id) : bot
          )
        );

        // Remove order from pending and add to processing
        setPendingOrders((prev) => removeOrderFromQueue(prev, nextOrder.id));
        setProcessingOrders((prev) => [
          ...prev,
          { ...nextOrder, status: 'processing' as const },
        ]);

        // Set timer to complete the order after processing time
        const timer = setTimeout(() => {
          // Remove from processing and move to complete
          setProcessingOrders((prev) => 
            prev.filter((order) => order.id !== nextOrder.id)
          );
          setCompleteOrders((prev) => [
            ...prev,
            { ...nextOrder, status: 'complete' as const },
          ]);

          // Reset bot to idle
          setBots((prevBots) =>
            prevBots.map((bot) =>
              bot.id === idleBot.id ? resetBot(bot) : bot
            )
          );

          // Clean up timer reference
          botTimersRef.current.delete(idleBot.id);
        }, BOT_PROCESSING_TIME_MS);

        // Store timer reference
        botTimersRef.current.set(idleBot.id, timer);
      }
    };

    processNextOrder();
  }, [pendingOrders, bots]);

  /**
   * Clean up all timers on unmount
   */
  useEffect(() => {
    return () => {
      botTimersRef.current.forEach((timer) => clearTimeout(timer));
      botTimersRef.current.clear();
    };
  }, []);

  const value: OrderContextValue = {
    pendingOrders,
    processingOrders,
    completeOrders,
    bots,
    theme,
    addOrder,
    addBot,
    removeBot,
    toggleTheme,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

/**
 * Hook to use the OrderContext
 */
export const useOrderContext = (): OrderContextValue => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
