# McDonald's Order Management System - Implementation Guide

## Overview

This is a comprehensive front-end implementation of the McDonald's Order Management System take-home assignment. The application features priority queue processing, dynamic bot management, and a modern glass-morphism UI with light/dark mode support.

## ✅ Requirements Completion

### User Stories Implementation

**✓ Normal Customer Story**
- Click "New Normal Order" → Order appears in PENDING area
- Bot processes order for 10 seconds → Order moves to COMPLETE area

**✓ VIP Customer Story**
- VIP orders are processed before NORMAL orders
- VIP orders queue behind existing VIP orders (FIFO within priority)
- Full support for VVIP orders (highest priority)

**✓ Manager Story**
- "+ Bot" button adds a new bot that immediately processes pending orders
- "- Bot" button removes the newest bot
- Orders being processed by removed bots return to PENDING

**✓ Bot Behavior**
- Each bot processes one order at a time
- Processing time: exactly 10 seconds per order
- Bots automatically pick up orders from PENDING queue

### Technical Requirements

✅ Frontend Implementation (React + TypeScript)  
✅ Priority Queue System (VVIP > VIP > NORMAL)  
✅ FIFO within same priority level  
✅ Unique, incrementing order numbers  
✅ No data persistence (in-memory state)  
✅ Comprehensive test coverage (61 passing tests)  
✅ Glass-morphism design with light/dark modes  
✅ Salmon and black color theme  
human
✅ Well-organized folder structure  
✅ DRY principles applied throughout  

## Quick Start

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

The application will be available at `http://localhost:5173/` (or next available port).

## Project Structure

```
src/
├── constants/          # CONSTANT_NAME format for all fixed values
│   ├── orderTypes.ts   # ORDER_TYPES, priority configuration
│   ├── botConfig.ts    # BOT_PROCESSING_TIME_MS, BotStatus
│   ├── theme.ts        # ThemeMode, theme colors
│   └── index.ts
├── utils/              # Business logic utilities
│   ├── types.ts        # TypeScript interfaces (Order, Bot)
│   ├── orderUtils.ts   # Order creation, ID generation, sorting
│   ├── queueManager.ts # Queue operations (add, remove, update)
│   ├── botUtils.ts     # Bot creation, assignment, state management
│   └── index.ts
├── context/            # React Context for state management
│   └── OrderContext.tsx # Main application state and logic
├── components/         # Reusable UI components
│   ├── OrderCard.tsx   # Order display with status badges
│   ├── BotCard.tsx     # Bot status and current order
│   ├── AreaContainer.tsx # Glass container for PENDING/COMPLETE
│   ├── ControlPanel.tsx  # Order and bot control buttons
│   ├── ThemeToggle.tsx   # Light/dark mode switcher
│   └── *.css           # Component-specific styles
├── screens/
│   └── OrderManagementScreen.tsx # Main application layout
├── theme/
│   └── antdTheme.ts    # Ant Design theme customization
├── __tests__/          # Comprehensive test suite
│   ├── utils/          # 39 unit tests for utilities
│   └── context/        # 22 integration tests for OrderContext
└── test/
    └── setup.ts        # Vitest configuration
```

## Key Features

### 1. Priority Queue System
- **Dynamic Priority Handling**: Orders are automatically sorted by priority
- **FIFO within Priority**: Same-priority orders maintain submission order
- **Extensible**: Add new priority levels by updating `ORDER_TYPES` constant

### 2. Bot Management
- **Start with 0 bots**: Manager must add bots to begin processing
- **Automatic Assignment**: Idle bots pick up next highest priority order
- **Interruption Handling**: Removing active bots returns orders to PENDING
- **Parallel Processing**: Multiple bots work simultaneously

### 3. Glass-morphism UI
- **Modern Design**: Transparent cards with backdrop blur
- **Dual Theme**: Light mode (salmon on gray) and dark mode (salmon on black)
- **Responsive**: Works on desktop and mobile
- **Smooth Animations**: Transitions and hover effects

## Usage Guide

### Initial State
- **0 Orders** in all queues
- **0 Bots** available
- **Light Mode** active

### Adding Orders
1. Click "New Normal Order" → Order #1 appears in PENDING
2. Click "New VIP Order" → Order #2 appears in PENDING (above normal orders)
3. Click "New VVIP Order" → Order #3 appears in PENDING (above all)

### Processing Orders
1. Click "+ Bot" → Bot #1 is created
2. Bot automatically picks up highest priority order (VVIP #3)
3. After 10 seconds → Order #3 moves to COMPLETE
4. Bot automatically picks up next order (VIP #2)

### Managing Bots
- **Add Bot**: Creates new bot with incremental ID
- **Remove Bot**: Removes newest bot (highest ID)
  - If bot is IDLE: Removed immediately
  - If bot is PROCESSING: Order returns to PENDING, then bot removed

### Theme Switching
Click the theme button to toggle between light and dark modes.

## Adding New Order Types

**Example: Adding "PLATINUM" tier**

1. Edit `src/constants/orderTypes.ts`:

```typescript
export const ORDER_TYPES: Record<string, OrderType> = {
  // ... existing types
  PLATINUM: {
    id: 'PLATINUM',
    label: 'Platinum',
    priority: 4,  // Higher than VVIP
    color: '#9333ea', // Purple
  },
};
```

2. Add button to `src/components/ControlPanel.tsx`:

```typescript
<Button
  type="primary"
  icon={<CrownOutlined />}
  onClick={() => addOrder('PLATINUM')}
  size="large"
  style={{ backgroundColor: '#9333ea', borderColor: '#9333ea' }}
>
  New Platinum Order
</Button>
```

That's it! The priority queue automatically handles the new tier.

## Testing

### Test Coverage
- **61 tests total** (100% passing)
- **39 util tests**: Queue operations, priority sorting, bot lifecycle
- **22 context tests**: Full integration scenarios

### Test Scenarios
✅ Order creation with unique IDs  
✅ Priority sorting (higher first, then FIFO)  
✅ Queue operations (add, remove, find, update)  
✅ Bot creation and assignment  
✅ Order processing flow (PENDING → PROCESSING → COMPLETE)  
✅ Bot removal during processing  
✅ Parallel processing with multiple bots  
✅ VVIP/VIP/NORMAL priority handling  
✅ Theme toggling  

### Running Tests

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# With UI
yarn test:ui

# Coverage report
yarn test:coverage
```

## Architecture Decisions

### State Management: React Context
- **Why**: Simpler than Redux for this scope, meets requirement
- **Structure**: Single OrderContext manages all state
- **Performance**: useCallback prevents unnecessary re-renders

### Priority Queue Algorithm
```typescript
// Sort by priority (descending), then timestamp (ascending)
orders.sort((a, b) => {
  if (a.priority !== b.priority) {
    return b.priority - a.priority; // Higher priority first
  }
  return a.timestamp - b.timestamp; // Older first (FIFO)
});
```

### Bot Processing Logic
- useEffect triggered when `pendingOrders` or `bots` change
- Finds idle bot and next order
- Sets 10-second timer using setTimeout
- Cleans up timers on unmount

### Constants Pattern
All configuration in constants with `CONSTANT_NAME` format:
- `BOT_PROCESSING_TIME_MS = 10000`
- `ORDER_TYPES` with priority levels
- `LIGHT_THEME_COLORS` and `DARK_THEME_COLORS`

## Design System

### Colors
- **Primary**: #FA8072 (Salmon) - Used for accents, borders
- **Secondary**: #FF6B6B - Hover states
- **Success**: #52c41a - Complete status
- **Warning**: #fa8c16 - VIP orders
- **Error**: #ff4d4f - Error states

### Glass Effect
```css
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7); /* Light mode */
  background: rgba(20, 20, 20, 0.7);    /* Dark mode */
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

## Performance Optimizations

1. **Memoization**: useCallback for all callbacks
2. **Immutable Updates**: Spread operators for state changes
3. **Timer Cleanup**: All setTimeout cleared on unmount
4. **Efficient Sorting**: Stable sort with single pass
5. **Type-only Imports**: Faster compilation with `import type`

## Browser Support

- Chrome 76+ (backdrop-filter)
- Firefox 103+ (backdrop-filter)
- Safari 9+ (backdrop-filter with -webkit prefix)
- Edge 79+

## Future Enhancements

Potential additions (not implemented):
- Persistent storage (localStorage/IndexedDB)
- Order history/analytics
- Bot performance metrics
- Estimated wait time display
- Order cancellation
- Sound notifications
- Animation when orders move between areas

## Known Limitations

- **No Persistence**: Refresh clears all data (as per requirements)
- **Fixed Processing Time**: All orders take exactly 10 seconds
- **No Order Details**: Orders only have ID and type
- **Manual Bot Management**: No auto-scaling based on queue length

## Documentation

- **Code Comments**: JSDoc for all public functions
- **Type Definitions**: Full TypeScript coverage
- **Test Descriptions**: Clear test names and assertions
- **This README**: Complete usage and implementation guide

## Contact

For questions about this implementation, please refer to the take-home assignment documentation or contact the interviewer.

---

**Built with**: React, TypeScript, Vite, Ant Design, Vitest  
**Design**: Glass-morphism with light/dark mode support  
**Testing**: 61 passing tests with comprehensive coverage  
**State**: React Context with priority queue algorithm
