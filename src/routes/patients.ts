import { Hono } from 'hono';
import { PatientTable } from '../drizzle/schema';
import { errorHandler } from '../middleware/errorHandler';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { jwtMiddleware } from '../middleware/jwt';

const patientRoute = new Hono();

// Apply error handling middleware
patientRoute.use('*', errorHandler);
patientRoute.use('*', jwtMiddleware);
// Get all patients
patientRoute.get('/', async (c) => {
  try {
    const patients = await db.select().from(PatientTable);
    return c.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return c.json({ error: 'Failed to fetch patients' }, 500);
  }
});

// Get a patient by ID
patientRoute.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const patient = await db
      .select()
      .from(PatientTable)
      .where(eq(PatientTable.id, id));

    if (patient.length === 0) {
      return c.json({ message: 'Patient not found' }, 404);
    }

    return c.json(patient[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return c.json({ error: 'Failed to fetch patient' }, 500);
  }
});

// Create a new patient
patientRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const [newPatient] = await db
      .insert(PatientTable)
      .values(body)
      .returning();

    return c.json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return c.json({ error: 'Failed to create patient' }, 500);
  }
});

// Update a patient by ID
patientRoute.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const [updatedPatient] = await db
      .update(PatientTable)
      .set(body)
      .where(eq(PatientTable.id, id))
      .returning();

    return c.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return c.json({ error: 'Failed to update patient' }, 500);
  }
});

// Delete a patient by ID
patientRoute.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await db.delete(PatientTable).where(eq(PatientTable.id, id));
    return c.text('Patient deleted');
  } catch (error) {
    console.error('Error deleting patient:', error);
    return c.json({ error: 'Failed to delete patient' }, 500);
  }
});

export default patientRoute;
