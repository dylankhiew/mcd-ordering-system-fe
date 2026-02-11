import React from 'react';
import { Button, Space, Card } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useOrderContext } from '../context/OrderContext';
import './ControlPanel.css';

export const ControlPanel: React.FC = () => {
  const { addOrder, addBot, removeBot, bots } = useOrderContext();

  return (
    <Card className="control-panel glass-card" variant="borderless">
      <div className="control-panel-content">
        <div className="control-section">
          <h3 className="section-title">Orders</h3>
          <Space size="middle" wrap>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => addOrder('NORMAL')}
              size="large"
            >
              New Normal Order
            </Button>
            <Button
              type="primary"
              icon={<CrownOutlined />}
              onClick={() => addOrder('VIP')}
              size="large"
              style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
            >
              New VIP Order
            </Button>
          </Space>
        </div>

        <div className="control-section">
          <h3 className="section-title">
            Bots <span className="bot-count">({bots.length})</span>
          </h3>
          <Space size="middle">
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={addBot}
              size="large"
            >
              + Bot
            </Button>
            <Button
              type="default"
              icon={<MinusOutlined />}
              onClick={removeBot}
              disabled={bots.length === 0}
              size="large"
              danger
            >
              - Bot
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};
