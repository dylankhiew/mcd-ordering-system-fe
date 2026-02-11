import React from 'react';
import { Card, Tag } from 'antd';
import type { Order } from '../utils/types';
import { ORDER_TYPES } from '../constants/orderTypes';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const orderType = ORDER_TYPES[order.type];
  
  const getStatusColor = () => {
    switch (order.status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'processing';
      case 'complete':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card
      className="order-card glass-card"
      size="small"
      variant="borderless"
    >
      <div className="order-card-content">
        <div className="order-header">
          <span className="order-id">#{order.id}</span>
          <Tag color={orderType?.color || 'default'}>
            {orderType?.label || order.type}
          </Tag>
        </div>
        <div className="order-status">
          <Tag color={getStatusColor()}>
            {order.status.toUpperCase()}
          </Tag>
        </div>
      </div>
    </Card>
  );
};
