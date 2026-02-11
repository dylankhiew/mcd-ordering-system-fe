import React from 'react';
import { Card, Tag, Badge } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import type { Bot } from '../utils/types';
import { BotStatus } from '../constants/botConfig';
import './BotCard.css';

interface BotCardProps {
  bot: Bot;
}

export const BotCard: React.FC<BotCardProps> = ({ bot }) => {
  const isProcessing = bot.status === BotStatus.PROCESSING;
  
  return (
    <Card
      className="bot-card glass-card"
      size="small"
      variant="borderless"
    >
      <div className="bot-card-content">
        <div className="bot-header">
          <div className="bot-icon-wrapper">
            <Badge
              status={isProcessing ? 'processing' : 'success'}
              dot
              offset={[-2, 2]}
            >
              <RobotOutlined className="bot-icon" />
            </Badge>
          </div>
          <span className="bot-id">Bot #{bot.id}</span>
        </div>
        <div className="bot-info">
          <Tag color={isProcessing ? 'blue' : 'green'}>
            {bot.status}
          </Tag>
          {isProcessing && bot.currentOrderId !== null && (
            <span className="processing-order">
              Processing Order #{bot.currentOrderId}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
