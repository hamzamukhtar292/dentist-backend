import { Hono } from 'hono';
import { db } from '../drizzle/db'; // Import your database instance
import { PatientFeeTable } from '../drizzle/schema';
import { errorHandler } from '../middleware/errorHandler';
import { eq } from 'drizzle-orm';
import { jwtMiddleware } from '../middleware/jwt';

const feeRouter = new Hono();

// Apply error handling middleware
feeRouter.use('*', errorHandler);
feeRouter.use('*', jwtMiddleware);

// Get all fees
feeRouter.get('/fees', async (c) => {
  try {
    const fees = await db.select().from(PatientFeeTable);
    return c.json(fees);
  } catch (error:any) {
    return c.json({ message: 'Failed to fetch fees', error: error.message }, 500);
  }
});

// Get a fee by ID
feeRouter.get('/patient-fee/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const fee = await db.select().from(PatientFeeTable).where(eq(PatientFeeTable.id, id));
    return c.json(fee.length > 0 ? fee[0] : { message: 'Fee not found' });
  } catch (error:any) {
    return c.json({ message: 'Failed to fetch fee', error: error.message }, 500);
  }
});

// Create a new fee
feeRouter.post('/create-fee', async (c) => {
  try {
    const body = await c.req.json();
    console.log(body);
    const newFee = await db.insert(PatientFeeTable).values(body).returning();
    return c.json(newFee[0]);
  } catch (error:any) {
    return c.json({ message: 'Failed to create fee', error: error.message }, 500);
  }
});

// Update a fee by ID
feeRouter.put('/update-fee/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const updatedFee = await db.update(PatientFeeTable).set(body).where(eq(PatientFeeTable.id, id)).returning();
    return c.json(updatedFee[0]);
  } catch (error:any) {
    return c.json({ message: 'Failed to update fee', error: error.message }, 500);
  }
});

// Delete a fee by ID
feeRouter.delete('/delete-fee/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await db.delete(PatientFeeTable).where(eq(PatientFeeTable.id, id));
    return c.text('Fee deleted');
  } catch (error:any) {
    return c.json({ message: 'Failed to delete fee', error: error.message }, 500);
  }
});

export default feeRouter;
