const request = require('supertest');
const express = require('express');
const coursesRouter = require('./courses');

const app = express();
app.use(express.json());
app.use('/api/courses', coursesRouter);

describe('Courses API', () => {
  it('should return all courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a specific course', async () => {
    const res = await request(app).get('/api/courses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should return 404 if course not found', async () => {
    const res = await request(app).get('/api/courses/999');
    expect(res.statusCode).toBe(404);
  });

  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({ name: 'course4' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'course4');
  });

  it('should return 400 for invalid course creation', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({ name: 'a' });
    expect(res.statusCode).toBe(400);
  });

  it('should update a course', async () => {
    const res = await request(app)
      .put('/api/courses/1')
      .send({ name: 'updatedCourse' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'updatedCourse');
  });

  it('should return 404 for updating non-existent course', async () => {
    const res = await request(app)
      .put('/api/courses/999')
      .send({ name: 'noCourse' });
    expect(res.statusCode).toBe(404);
  });

  it('should delete a course', async () => {
    const res = await request(app).delete('/api/courses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should return 404 for deleting non-existent course', async () => {
    const res = await request(app).delete('/api/courses/999');
    expect(res.statusCode).toBe(404);
  });
});