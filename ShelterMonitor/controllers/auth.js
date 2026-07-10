import db from '../utils/database.js';
import { UnauthorizedError, BadRequestError } from '../utils/errors.js';
import { getUserByUsername } from './users.js';
import jwt from 'jsonwebtoken';


export async function login(req, res, next) {
    // Implementation for login function
    const { username, password } = req.body;
    try {
        const [results, fields] = await getUserByUsernameAndPassword(username, password);
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
export function makeJWT(userID, expiresIn = 3600, secret) {
    const payload = {
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn, // Default expiration time of 1 hour
    };

    return jwt.sign(payload, secret);
}

export function verifyJWT(token, secret) {
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

export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new BadRequestError("Authorization header is missing");
    }
    return extractBearerToken(authHeader);
};

export function extractBearerToken(header) {
    const splitAuth = header.split(" ");
    if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
        throw new BadRequestError("Invalid Authorization header format");
    }
    return splitAuth[1];
};

export function getAdminAuth(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorizedError("Authorization header is missing");
    }
    const token = getBearerToken(req);
    const reqUserId = verifyJWT(token, process.env.JWT_SECRET);
    if (!reqUserId) {
        throw new UnauthorizedError("Invalid token");
    }
    if (getUserAdmin(reqUserId) !== 1) {
        throw new UnauthorizedError("User is not an admin");
    }
    return reqUserId;
}