export interface OrderType {
  id: string;
  label: string;
  priority: number;
  color: string;
}

export const ORDER_TYPES: Record<string, OrderType> = {
  NORMAL: {
    id: 'NORMAL',
    label: 'Normal',
    priority: 1,
    color: '#52c41a',
  },
  VIP: {
    id: 'VIP',
    label: 'VIP',
    priority: 2,
    color: '#fa8c16',
  },
  VVIP: {
    id: 'VVIP',
    label: 'VVIP',
    priority: 3,
    color: '#eb2f96',
  },
};

export const getOrderTypesByPriority = (): OrderType[] => {
  return Object.values(ORDER_TYPES).sort((a, b) => b.priority - a.priority);
};
