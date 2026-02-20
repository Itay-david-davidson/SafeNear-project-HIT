import db from '../utils/database.js';
import Map from '../models/map.js';

export async function getMaps(req, res) {
    try {
            const maps = await Map.fetchAll();
            res.json(maps);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Error fetching maps' });
        }
}

export async function getMapById(req, res) {
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
        res.status(500).json({ message: 'Error fetching map' });
    }
};

export async function insertMap(req, res) {
    try {
        const name = req.body.name;
        const filePath = req.body.filePath;

        const map = new Map(name, filePath);
        await map.save();
        res.json({ message: 'Map inserted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error inserting map' });
    }
};

export async function updateMap(req, res) {
    try {
        const mapId = req.params.id;
        const name = req.body.name;
        const filePath = req.body.filePath;

        const [results, fields] = await db.execute('UPDATE maps SET name = ?, file_path = ? WHERE id = ?', [name, filePath, mapId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Map updated successfully' });
        } else {
            res.status(404).json({ message: 'Map not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating map' });
    }
};

export async function deleteMap(req, res) {
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
        res.status(500).json({ message: 'Error deleting map' });
    }
};

export default {
    getMaps,
    getMapById,
    insertMap,
    updateMap,
    deleteMap
};