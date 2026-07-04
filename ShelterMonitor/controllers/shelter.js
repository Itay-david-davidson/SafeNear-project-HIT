import db from '../utils/database.js';
import Shelter from '../models/shelter.js';

export async function getShelters(req, res) {
        const shelters = await Shelter.fetchAll();
        res.json(shelters);
};

export async function getShelterById(req, res) {
    const shelterId = req.params.id;
    const [results, fields] = await db.execute('SELECT * FROM shelters WHERE id = ? LIMIT 1', [shelterId]);
    if (results.length > 0) {
        res.json(results[0]);
    } else {
        throw new NotFoundError('Shelter not found');
    }
};

export async function insertShelter(req, res) {
    const reqUserId = await getAdminAuth(req);
    const name = req.body.name;
    const open = req.body.open;
    const location = req.body.location;
    const mapID = req.body.mapID;
    
    const newShelter = new Shelter(name, open, location, mapID);
    await newShelter.save();
    res.json({ message: 'Shelter inserted successfully' });
};

export async function updateShelter(req, res) {
    const reqUserId = await getAdminAuth(req);
    const shelterId = req.params.id;
    const name = req.body.name;
    const open = req.body.open;
    const location = req.body.location;
    const mapID = req.body.mapID;

    const [results, fields] = await db.execute('UPDATE shelters SET name = ?, open = ?, location = ?, map_id = ? WHERE id = ?', [name, open, location, mapID, shelterId]);
    if (results.affectedRows > 0) {
        res.json({ message: 'Shelter updated successfully' });
    } else {
        throw new NotFoundError('Shelter not found');
    }
};

export async function deleteShelter(req, res) {
    const reqUserId = await getAdminAuth(req);
    const shelterId = req.params.id;
    const [results, fields] = await db.execute('DELETE FROM shelters WHERE id = ?', [shelterId]);
    if (results.affectedRows > 0) {
        res.json({ message: 'Shelter deleted successfully' });
    } else {
        throw new NotFoundError('Shelter not found');
    }
};

export default {
    getShelters,
    getShelterById,
    insertShelter,
    updateShelter,
    deleteShelter
};

