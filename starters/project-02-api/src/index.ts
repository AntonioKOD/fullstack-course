import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Project 02 API' });
});

// Add your routes here: auth, resources, etc.

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
