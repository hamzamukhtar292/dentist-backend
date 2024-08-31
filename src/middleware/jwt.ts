import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const jwtMiddleware = createMiddleware(
  async (c:any, next) => {
    console.log(c.req.header);
    const authHeader = c.req.header('Authorization');
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      c.req.user = decoded; 
      await next();
    } catch (err) {
      console.error("Token verification failed:", err);
      return c.json({ message: 'Unauthorized' }, 401);
    }
  },
);
