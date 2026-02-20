import db from '../utils/database.js';

export class User {
    constructor(username, password, admin) {
        this.username = username;
        this.password = password;
        this.admin = admin;
    }

    save() {
        return db.execute('INSERT INTO users (username, password, admin, created_at) VALUES (?, ?, ?, NOW())', [ this.username, this.password, this.admin]);
    };


    static fetchAll() {
        return db.execute('SELECT * FROM users');
    };

};