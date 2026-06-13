import { calcScore } from './carbonCalculator';
import { describe, it, expect } from 'vitest';

describe('Carbon Calculator (Frontend)', () => {
  it('returns correct carbon value', () => {
    // car (70) + electricity (100 * 0.85 = 85) + veg (20) + low waste (10) = 185
    expect(calcScore('car', 100, 'veg', 'low')).toBe(185);
  });

  it('handles zero values and unknown categories', () => {
    expect(calcScore('unknown', 0, 'unknown', 'unknown')).toBe(0);
  });

  it('handles large values', () => {
    // flight (100) + electricity (1000 * 0.85 = 850) + nonveg (80) + high (50) = 1080
    expect(calcScore('flight', 1000, 'nonveg', 'high')).toBe(1080);
  });

  it('parses string electricity values correctly', () => {
    expect(calcScore('bike', '200', 'mixed', 'medium')).toBe(260); 
    // bike (10) + 200*0.85 (170) + mixed (50) + medium (30) = 260
  });
});
