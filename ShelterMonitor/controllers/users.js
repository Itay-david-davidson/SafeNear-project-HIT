import db from '../utils/database.js';
import User from '../models/users.js';

//TODO: figure out .json thingy
export async function getUsers(req, res) {
    try {
        const users = await User.fetchAll();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching users' });
    }
}

export async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const [results, fields] = await db.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export async function insertUser(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const admin = req.body.admin;

        const user = new User(username, password, admin);
        await user.save();
        res.json({ message: 'User inserted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error inserting user' });
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const username = req.body.username;
        const password = req.body.password;
        const admin = req.body.admin;

        const [results, fields] = await db.execute('UPDATE users SET username = ?, password = ?, admin = ? WHERE id = ?', [username, password, admin, userId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating user' });
    }
};

export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const [results, fields] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

export default {
    getUsers,
    getUserById,
    insertUser,
    updateUser,
    deleteUser
};