const transportScores = { bike: 10, train: 25, bus: 30, car: 70, flight: 100 };
const foodScores      = { veg: 20, mixed: 50, nonveg: 80 };
const wasteScores     = { low: 10, medium: 30, high: 50 };

/**
 * Calculates the total carbon score based on user input.
 * @param {Object} data - The user's input data.
 * @param {string} data.transport - The type of transport used.
 * @param {number|string} data.electricity - The monthly electricity usage in kWh.
 * @param {string} data.food - The type of diet.
 * @param {string} data.waste - The level of waste generation.
 * @returns {number} The calculated carbon score.
 */
export function calcScore({ transport, electricity, food, waste }) {
  const t = transportScores[transport] || 0;
  const e = (parseFloat(electricity) || 0) * 0.85;
  const f = foodScores[food] || 0;
  const w = wasteScores[waste] || 0;
  return parseFloat((t + e + f + w).toFixed(2));
}

export { transportScores, foodScores, wasteScores };
