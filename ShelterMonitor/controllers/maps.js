import db from '../utils/database.js';
import Map from '../models/map.js';

import { getAdminAuth } from './auth.js';

export async function getMaps(req, res, next) {
    try {
        const [maps] = await Map.fetchAll();
        res.json(maps);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function getMapById(req, res, next) {
    try {
        const mapId = req.params.id;
        const [results, fields] = await db.execute('SELECT * FROM maps WHERE id = ? LIMIT 1', [mapId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Map not found' });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export async function insertMap(req, res, next) {
    try {
        const name = req.body.name;
        const path = req.file ? req.file.filename : req.body.path;

        if (!path) {
             return res.status(400).json({ message: 'Map image is required' });
        }

        const map = new Map(name, path);
        await map.save();
        res.json({ message: 'Map inserted successfully', path: path });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export async function updateMap(req, res, next) {
    try {
        const mapId = req.params.id;
        const name = req.body.name;
        const path = req.file ? req.file.filename : req.body.path;

        const [results, fields] = await db.execute('UPDATE maps SET name = ?, path = ? WHERE id = ?', [name, path, mapId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Map updated successfully', path: path });
        } else {
            res.status(404).json({ message: 'Map not found' });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export async function deleteMap(req, res, next) {
    try {
        const mapId = req.params.id;

        const [results, fields] = await db.execute('DELETE FROM maps WHERE id = ?', [mapId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Map deleted successfully' });
        } else {
            res.status(404).json({ message: 'Map not found' });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export default {
    getMaps,
    getMapById,
    insertMap,
    updateMap,
    deleteMap
};