import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import shelterRoutes from './routes/shelterRoutes.js';
import mapRoutes from './routes/mapsRoutes.js';
  

const app = express();
const port = process.env.NODE_DOCKER_PORT || 6969;

console.log(process.env.DB_HOST);
  
app.use(express.json());

app.use('/maps', mapsRoutes);
app.use('/users', userRoutes);     
app.use('/shelters', shelterRoutes); 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/maps', mapRoutes);


//error handling middleware
app.use((err, req, res, next) => {
  console.log("Error occurred:", err);
  if (err instanceof BadRequestError) {
    res.status(400).json({ error: err.message });
  }
  else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  }
  else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
  }
  else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  }
  else {
    console.log("Unexpected error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});