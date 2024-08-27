import { MiddlewareHandler } from 'hono';

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    c.status(500);
    return c.json({ message: 'Internal Server Error' });
  }
};
