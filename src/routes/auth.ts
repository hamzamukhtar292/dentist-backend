import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { db } from '../drizzle/db';
import { UserTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const authRouter = new Hono();

authRouter.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Fetch user from database
    const users:any = await db.select().from(UserTable).where(eq(UserTable.email, email));
    const user = users[0];
    if (!user) {
      return c.json({ message: 'Invalid email or password' }, 401);
    }

    // Verify password
    try {
      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) {
        return c.json({ message: 'Invalid email or password' }, 401);
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      return c.json({ message: 'Error during login' }, 500);
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    return c.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ message: 'Error during login' }, 500);
  }
});

export default authRouter;
