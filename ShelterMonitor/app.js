import 'dotenv/config';
import express from 'express';
import mapsRoutes from './routes/mapsRoutes.js'; 

const app = express();
const port = process.env.NODE_DOCKER_PORT || 6969;

app.use(express.json());

app.use('/maps', mapsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});