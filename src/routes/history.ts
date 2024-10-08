// import { Hono } from 'hono';
// import { db } from '../drizzle/db'; // Import your database instance
// import { PatientHistoryTable } from '../drizzle/schema';
// import { errorHandler } from '../middleware/errorHandler';
// import { eq } from 'drizzle-orm';
// import { jwtMiddleware } from '../middleware/jwt';

// const historyRoute = new Hono();

// // Apply error handling middleware
// historyRoute.use('*', errorHandler);
// historyRoute.use('*', jwtMiddleware);

// // Get all history records
// historyRoute.get('/', async (c) => {
//   try {
//     const history = await db.select().from(PatientHistoryTable);
//     return c.json(history);
//   } catch (error) {
//     return c.json({ error: 'Failed to fetch history records' }, 500);
//   }
// });

// // Get a history record by ID
// historyRoute.get('/:id', async (c) => {
//   try {
//     const id = c.req.param('id');
//     const record = await db
//       .select()
//       .from(PatientHistoryTable)
//       .where(eq(PatientHistoryTable.id, id));

//     if (record.length === 0) {
//       return c.json({ message: 'History record not found' }, 404);
//     }

//     return c.json(record[0]);
//     return c.json({ error: 'Failed to fetch history record' }, 500);
//   }
// });

// // Create a new history record
// historyRoute.post('/', async (c) => {
//   try {
//     const body = await c.req.json();
//     const [newRecord] = await db
//       .insert(PatientHistoryTable)
//       .values(body)
//       .returning();

//     return c.json(newRecord);
//   } catch (error) {
//     console.error('Error creating history record:', error);
//     return c.json({ error: 'Failed to create history record' }, 500);
//   }
// });

// // Update a history record by ID
// historyRoute.put('/:id', async (c) => {
//   try {
//     const id = c.req.param('id');
//     const body = await c.req.json();
//     const [updatedRecord] = await db
//       .update(PatientHistoryTable)
//       .set(body)
//       .where(eq(PatientHistoryTable.id, id))
//       .returning();

//     return c.json(updatedRecord);
//   } catch (error) {
//     console.error('Error updating history record:', error);
//     return c.json({ error: 'Failed to update history record' }, 500);
//   }
// });

// // Delete a history record by ID
// historyRoute.delete('/:id', async (c) => {
//   try {
//     const id = c.req.param('id');
//     await db.delete(PatientHistoryTable).where(eq(PatientHistoryTable.id, id));
//     return c.text('History record deleted');
//   } catch (error) {
//     console.error('Error deleting history record:', error);
//     return c.json({ error: 'Failed to delete history record' }, 500);
//   }
// });

// export default historyRoute;
