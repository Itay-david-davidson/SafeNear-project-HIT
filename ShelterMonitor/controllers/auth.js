import db from '../config/db.js';
import { UnauthorizedError } from '../models/errors.js';
import { getUserByUsername } from './users.js';
import jwt from 'jsonwebtoken';

export async function login(req, res, next) {
    // Implementation for login function
    const { username, password } = req.body;
    try {
        const [results, fields] = await getUserByUsername(username);
        if (results.length > 0) {
            // User found, proceed with login
            const token = await makeJWT(results[0].id, 3600, process.env.JWT_SECRET); // Token expires in 1 hour
            res.json({ message: 'Login successful', user: results[0], token: token });
        } else {
            // User not found or incorrect credentials
            throw new UnauthorizedError('Incorrect username or password');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error during login' });
    }

};


// Function to generate JWT token
export async function makeJWT(userID, expiresIn, secret) {
    const payload = {
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn, // Default expiration time of 1 hour
    }

    return jwt.sign(payload, secret);
}

export async function verifyJWT(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            throw new UnauthorizedError('Invalid token');
        }
        return decoded.sub; // Return the user ID from the token payload
    } catch (err) {
        console.log(err);
        throw new UnauthorizedError('Invalid token');
    }
};