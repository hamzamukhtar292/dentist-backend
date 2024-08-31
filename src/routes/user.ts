// userRoutes.ts
import { Hono } from 'hono';
import { db } from '../drizzle/db';
import { UserTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { jwtMiddleware } from '../middleware/jwt';

const userRouter = new Hono();
userRouter.use('*', jwtMiddleware);

// Define your routes here
userRouter.get('/users', async (c) => {
  try {
    // Fetch all users from the database
    const users = await db.query.UserTable.findMany();
    return c.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ message: 'Error fetching users' }, 500);
  }
});

userRouter.get('/user/:id', async (c) => {
  const userId = c.req.param('id');
  try {
    // Fetch users based on the provided ID
    const users = await db.select().from(UserTable).where(eq(UserTable.id, userId));
    
    // Check if any user is found
    if (users.length > 0) {
      // Return the first user as an object, not an array
      return c.json(users[0]);
    } else {
      return c.notFound();
    }
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return c.json({ message: 'Error fetching user' }, 500);
  }
});


userRouter.post('/create-users', async (c) => {
    try {
      const newUser = await c.req.json();
  
      // Hash the password using argon2
      if (newUser.password) {
        newUser.password = await argon2.hash(newUser.password);
      }
  
      // Insert the new user into the database
      await db.insert(UserTable).values(newUser);
  
      return c.json({ message: 'User created successfully' }, 201);
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json({ message: 'Error creating user' }, 500);
    }
  });

userRouter.put('/update-user/:id', async (c) => {
  const userId = c.req.param('id');
  console.log({userId});
  try {
    const updatedUser = await c.req.json();
    // Update user information
    await db.update(UserTable).set(updatedUser).where(eq(UserTable.id, userId));
    return c.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    return c.json({ message: 'Error updating user' }, 500);
  }
});

userRouter.delete('/users/:id', async (c) => {
  const userId = c.req.param('id');
  try {
    await db.delete(UserTable).where(eq(UserTable.id, userId));
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    return c.json({ message: 'Error deleting user' }, 500);
  }
});

export default userRouter;
