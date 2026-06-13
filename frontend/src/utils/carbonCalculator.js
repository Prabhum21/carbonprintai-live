export const transportScores = { bike: 10, train: 25, bus: 30, car: 70, flight: 100 };
export const foodScores      = { veg: 20, mixed: 50, nonveg: 80 };
export const wasteScores     = { low: 10, medium: 30, high: 50 };

/**
 * Calculates the total carbon score based on user input.
 * @param {string} transport - The type of transport used.
 * @param {number|string} electricity - The monthly electricity usage in kWh.
 * @param {string} food - The type of diet.
 * @param {string} waste - The level of waste generation.
 * @returns {number} The calculated carbon score.
 */
export function calcScore(transport, electricity, food, waste) {
  const t = transportScores[transport] || 0;
  const e = (parseFloat(electricity) || 0) * 0.85;
  const f = foodScores[food] || 0;
  const w = wasteScores[waste] || 0;
  return parseFloat((t + e + f + w).toFixed(2));
}
