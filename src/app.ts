import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import authRoutes from './modules/auth/auth.routes';
import teamRoutes from './modules/team/team.routes';
import fixtureRoutes from './modules/fixture/fixture.routes';
import { MONGO_URI, REDIS_URL, SESSION_SECRET } from './environment/config';
import { errorHandler } from './middlewares/error-handler';
import cors from 'cors'
import helmet from 'helmet';
import rtracer from 'cls-rtracer';
import morgan from 'morgan';
import logger from './utils/logger';
import { errorResMsg } from './utils/response';
import { StatusCodes } from 'http-status-codes';
import apiLimiter from './middlewares/ratelimit';



const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(
  express.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

app.use(cors());
app.use(helmet.hidePoweredBy());

app.use(rtracer.expressMiddleware());

// logging
morgan.token("requestId", (): any => rtracer.id());
const loggerFormat =
  '[:requestId] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

app.use(morgan(loggerFormat, {
  stream: {
    write: (message) => {
      // Use Winston to log the message generated by Morgan
      logger.info(message.trim());
    },
  },
})); //to output stream logss to the console
// MongoDB connection
mongoose.connect(MONGO_URI!, {})
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error(err.message, err.stack));

// Redis setup
const redisClient = new Redis(REDIS_URL);

redisClient.on('connect', () => logger.info('Connected to Redis'));

// Initialize store.
let redisStore = new (RedisStore as any)({client: redisClient})

// Configure session middleware
app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // set to true in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(apiLimiter)

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler)

app.use((_, res) => {
    errorResMsg(res, StatusCodes.NOT_FOUND, "Endpoint not found");
});

export default app;
