import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5050;
import cors from 'cors';
import bookRoutes from './routes/books.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("API is working"));

app.use('/api/books', bookRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
