import React from 'react';
import { ConfigProvider } from 'antd';
import { OrderProvider, useOrderContext } from './context/OrderContext';
import { OrderManagementScreen } from './screens';
import { getAntdTheme } from './theme';
import './App.css';

const ThemedApp: React.FC = () => {
  const { theme } = useOrderContext();
  
  return (
    <ConfigProvider theme={getAntdTheme(theme)}>
      <div className={`app ${theme}`}>
        <OrderManagementScreen />
      </div>
    </ConfigProvider>
  );
};

function App() {
  return (
    <OrderProvider>
      <ThemedApp />
    </OrderProvider>
  );
}

export default App;

