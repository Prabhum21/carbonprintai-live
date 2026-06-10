import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Simple check to see if the Navbar loaded (it has "CarbonWise AI" text)
    expect(screen.getByText(/CarbonWise AI/i)).toBeDefined();
  });
});
