import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Page', () => {
  it('renders main heading and call to action', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Based on standard home page content; check if typical texts exist
    expect(screen.getByText(/Track, Reduce, and Offset/i)).toBeDefined();
    expect(screen.getByText(/Calculate Now/i)).toBeDefined();
  });
});
