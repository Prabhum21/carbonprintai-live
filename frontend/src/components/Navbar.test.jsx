import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders CarbonWise AI title and links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/CarbonWise AI/i)).toBeDefined();
    expect(screen.getByText(/Calculator/i)).toBeDefined();
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
    expect(screen.getByText(/AI Advisor/i)).toBeDefined();
    expect(screen.getByText(/Challenges/i)).toBeDefined();
  });
});
