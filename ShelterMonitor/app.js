import express from 'express';
const app = express();
const port = process.env.NODE_DOCKER_PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});