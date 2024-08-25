import "dotenv/config"
import { cors } from 'hono/cors'
import { apiReference } from "@scalar/hono-api-reference";
import { serve } from '@hono/node-server';
import  userRouter  from './userRoutes/userRoutes';
import { Hono } from "hono";
import authRouter from "./authRoutes/authRoutes";
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
  
  console.log(`Server is running on port ${process.env.PORT}`);
  serve({
    fetch: app.fetch,
    port:process.env.PORT as any,
  });
