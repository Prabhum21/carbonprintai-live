import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/api.js';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  it('POST /api/calculate should return a correct carbon score', async () => {
    const response = await request(app)
      .post('/api/calculate')
      .send({
        transport: 'car',
        electricity: '100',
        food: 'veg',
        waste: 'low'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('score');
    
    // car (70) + electricity (100 * 0.85 = 85) + veg (20) + low waste (10) = 185
    expect(response.body.score).toBe(185);
  });
});
