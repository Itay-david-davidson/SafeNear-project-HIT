import db from '../utils/database.js';

export class Shelter {
    constructor(name, open, location, map_id ) {
        this.name = name;
        this.open = open;
        this.location = location;
        this.map_id = map_id;
    }

    save() {
        return db.execute('INSERT INTO shelters (name, open, location, map_id) VALUES (?, ?, ?, ?)', [this.name, this.open, this.location, this.map_id]);
    };

    static fetchAll() {
        return db.execute('SELECT * FROM shelters');
    };

};

export default Shelter;