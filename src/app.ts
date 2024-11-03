import express from 'express';
import userRoutes from './routes/UserRoutes';
import recordsRoutes from './routes/RecordsRoutes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', recordsRoutes);

export default app;