import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Calculator from './Calculator';

// Mock recharts because it uses ResizeObserver which may not be available in jsdom without polyfill
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div>BarChart</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe('Calculator Page', () => {
  it('renders calculator form correctly', () => {
    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );
    
    // Check for standard form labels or texts we expect in Calculator
    expect(screen.getByText(/Carbon Footprint Calculator/i)).toBeDefined();
    expect(screen.getByText(/Transport Method/i)).toBeDefined();
    expect(screen.getByText(/Monthly Electricity/i)).toBeDefined();
    expect(screen.getByText(/Calculate Footprint/i)).toBeDefined();
  });
});
