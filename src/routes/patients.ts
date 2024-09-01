import { Hono } from 'hono';
import { PatientTable } from '../drizzle/schema';
import { errorHandler } from '../middleware/errorHandler';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { jwtMiddleware } from '../middleware/jwt';
import moment from 'moment';
import { between } from 'drizzle-orm'; // Use appropriate ORM function for filtering
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

patientRoute.post('/create-patient', async (c) => {
  try {
    const body = await c.req.json();

    // Data validation and type conversion to ensure the correct types
    const newPatientData = {
      name: body.name, // Should be a string
      age: parseInt(body.age, 10), // Convert to integer, add validation if necessary
      address: body.address, // Should be a string
      todayTurn: body.todayTurn,
      phoneNumber: body.phoneNumber, // Should be a string
      diagnose: body.diagnose || 'default', // Optional field with a default value
      treatment: body.treatment || 'default', // Optional field with a default value
      created_at: new Date(), // Automatically set to current date
      updated_at: new Date(), // Automatically set to current date
    };

    // Insert into the database
    const [newPatient] = await db
      .insert(PatientTable)
      .values(newPatientData)
      .returning();

    return c.json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return c.json({ error: 'Failed to create patient' }, 500);
  }
});


patientRoute.get('/patients/today', async (c) => {
  try {
    // Get the start and end of today using moment.js
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    // Query to find users created today using the correct column name 'createdAt'
    const usersToday = await db
      .select()
      .from(PatientTable)
      .where(
        // Filter users where 'createdAt' is between today's start and end
        between(PatientTable.createdAt, todayStart, todayEnd)
      );

    return c.json(usersToday);
  } catch (error) {
    console.error('Error fetching users created today:', error);
    return c.json({ error: 'Failed to fetch users created today' }, 500);
  }
});



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
