import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useOrderContext } from '../context/OrderContext';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useOrderContext();
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle">
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        size="default"
      />
    </div>
  );
};
