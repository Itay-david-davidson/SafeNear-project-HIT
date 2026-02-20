import db from '../utils/database.js';

export class Map {
    constructor( name, filePath) {
        this.name = name;
        this.filePath = filePath;
    }

    save() {
        return db.execute('INSERT INTO maps (name, file_path) VALUES (?, ?)', [this.name, this.filePath]);
    };

    static fetchAll() {
        return db.execute('SELECT * FROM maps');
    };

};

export default Map;