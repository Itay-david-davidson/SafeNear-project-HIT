import db from '../utils/database.js';
import shelter from '../models/shelter.js';

export async function getShelters(req, res) {
    try {
        const shelters = await shelter.fetchAll();
        res.json(shelters);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching shelters' });
    }
};

export async function getShelterById(req, res) {
    try {
        const shelterId = req.params.id;
        const [results, fields] = await db.execute('SELECT * FROM shelters WHERE id = ? LIMIT 1', [shelterId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Shelter not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching shelter' });
    }
};

export async function insertShelter(req, res) {
    try {
        const name = req.body.name;
        const open = req.body.open;
        const location = req.body.location;
        const mapID = req.body.mapID;
        
        const newShelter = new shelter(name, open, location, mapID);
        await newShelter.save();
        res.json({ message: 'Shelter inserted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error inserting shelter' });
    }
};

export async function updateShelter(req, res) {
    try {
        const shelterId = req.params.id;
        const name = req.body.name;
        const open = req.body.open;
        const location = req.body.location;
        const mapID = req.body.mapID;

        const [results, fields] = await db.execute('UPDATE shelters SET name = ?, open = ?, location = ?, map_id = ? WHERE id = ?', [name, open, location, mapID, shelterId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Shelter updated successfully' });
        } else {
            res.status(404).json({ message: 'Shelter not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating shelter' });
    }
};

export async function deleteShelter(req, res) {
    try {
        const shelterId = req.params.id;
        const [results, fields] = await db.execute('DELETE FROM shelters WHERE id = ?', [shelterId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Shelter deleted successfully' });
        } else {
            res.status(404).json({ message: 'Shelter not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deleting shelter' });
    }
};

export default {
    getShelters,
    getShelterById,
    insertShelter,
    updateShelter,
    deleteShelter
};

