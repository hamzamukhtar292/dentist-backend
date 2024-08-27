import "dotenv/config"
import { cors } from 'hono/cors'
import { apiReference } from "@scalar/hono-api-reference";
import { serve } from '@hono/node-server';
import  userRouter  from './routes/user';
import { Hono } from "hono";
import authRouter from "./routes/auth";
import feeRouter from "./routes/fees";
import patientRoute from "./routes/patients";
import historyRoute from "./routes/history";
const app = new Hono();

// Enable CORS for all routes
app.use('*',cors({
  origin: '*', // TODO: for development- should be clearer.
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // replace with the methods your client uses
  allowHeaders: ['*'], // TODO: for development
}));

  app.get(
    "/",
    apiReference({
      spec: {
        url: "/doc",
      },
    }),
  );
  app.get("/test", (c) => {
    return c.json({ message: "Server is running!" });
  });

  app.route('/auth', authRouter);
  app.route('/api', userRouter);
  app.route('/api', feeRouter);
  app.route('/api', patientRoute);
  app.route('/api', historyRoute);



  
  console.log(`Server is running on port ${process.env.PORT}`);
  serve({
    fetch: app.fetch,
    port:process.env.PORT as any,
  });
