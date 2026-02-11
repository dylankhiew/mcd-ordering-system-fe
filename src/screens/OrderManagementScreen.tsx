import React from 'react';
import { Row, Col, Empty } from 'antd';
import { useOrderContext } from '../context/OrderContext';
import {
  OrderCard,
  BotCard,
  AreaContainer,
  ControlPanel,
  ThemeToggle,
} from '../components';
import './OrderManagementScreen.css';

export const OrderManagementScreen: React.FC = () => {
  const { pendingOrders, completeOrders, bots } = useOrderContext();

  return (
    <div className="order-management-screen">
      <ThemeToggle />
      <div className="screen-header">
        <h1 className="screen-title">McDonald's Order Management System</h1>
        <p className="screen-subtitle">
          Manage orders and bots efficiently with priority queue processing
        </p>
      </div>

      <ControlPanel />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <AreaContainer title="Pending" count={pendingOrders.length}>
            {pendingOrders.length === 0 ? (
              <Empty
                description="No pending orders"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </AreaContainer>
        </Col>

        <Col xs={24} lg={8}>
          <AreaContainer title="Complete" count={completeOrders.length}>
            {completeOrders.length === 0 ? (
              <Empty
                description="No completed orders"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              completeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </AreaContainer>
        </Col>

        <Col xs={24} lg={8}>
          <AreaContainer title="Bots" count={bots.length}>
            {bots.length === 0 ? (
              <Empty
                description="No bots available. Click '+ Bot' to add one."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              bots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))
            )}
          </AreaContainer>
        </Col>
      </Row>
    </div>
  );
};
