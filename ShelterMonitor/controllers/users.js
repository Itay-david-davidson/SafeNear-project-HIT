import { connect } from '../app.js';

//TODO: figure out .json thingy
export async function getUsers(req, res) {
    const [results, fields] = await connect.execute('SELECT * FROM users');
    //res.json(results);
    console.log(results);
}

export async function getUserById(req, res) {
    const userId = req.params.id;
    const [results, fields] = await connect.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    if (results.length > 0) {
        res.json(results[0]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export async function insertUser(req, res) {
    const { id,username,password,admin } = req.body;
    const [result] = await connect.execute('INSERT INTO users (id,username,password,admin,created_at) VALUES (?, ?, ?, ?, NOW())', [id,username,password,admin]);
    //res.json({ id: result.insertId, username, password, admin });
}

export default {
    getUsers,
    getUserById,
    insertUser
};