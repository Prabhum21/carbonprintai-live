import { calcScore } from '../utils/carbonCalculator';

describe('Carbon Calculator (Backend)', () => {
  test('returns correct carbon value', () => {
    // car (70) + electricity (100 * 0.85 = 85) + veg (20) + low waste (10) = 185
    expect(calcScore({ transport: 'car', electricity: 100, food: 'veg', waste: 'low' })).toBe(185);
  });

  test('handles zero values and unknown categories', () => {
    expect(calcScore({ transport: 'unknown', electricity: 0, food: 'unknown', waste: 'unknown' })).toBe(0);
  });

  test('handles large values', () => {
    // flight (100) + electricity (1000 * 0.85 = 850) + nonveg (80) + high (50) = 1080
    expect(calcScore({ transport: 'flight', electricity: 1000, food: 'nonveg', waste: 'high' })).toBe(1080);
  });

  test('parses string electricity values correctly', () => {
    expect(calcScore({ transport: 'bike', electricity: '200', food: 'mixed', waste: 'medium' })).toBe(260); 
    // bike (10) + 200*0.85 (170) + mixed (50) + medium (30) = 260
  });
});
