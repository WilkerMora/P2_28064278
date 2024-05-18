const sqlite3 = require("sqlite3").verbose();

class ContactosModel {
    constructor() {
            console.log("Iniciando WilkerMora")
        this.db = new sqlite3.Database("./config/test.db", (err) => {
          if (err) {
            console.error(err.message);
            return
            }
            console.log("Conectado a la base de datos SQLite3");
            
        });

        this.db.run(
            "CREATE TABLE IF NOT EXISTS contactos (email TEXT, nombre TEXT, mensaje TEXT, ip TEXT, fecha TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT)",
            (err) => {
                if (err) {
                    console.error(err.message)
                }
            }
        )
    }

    crearcontactos(email, nombre, mensaje, ip, fecha) {
        return new Promise((resolve, reject) => {
           const sql = `INSERT INTO contactos (email, nombre, mensaje, ip, fecha) VALUES (?, ?, ?, ?, ?)`;
           this.db.run(sql, [email, nombre, mensaje, ip, fecha], function (err){
            if (err) {
                console.error(err.message);
                reject(err);
            }
            console.log(`Se ha insertado una fila con el ID ${this.lastID}`);
            resolve(this.lastID);
           }); 
        });
    }

    async obtenercontactos(email) {
        const sql = `SELECT * FROM contactos WHERE email = ?`;
        const get = promisify(this.db.get).bind(this.db);
        return await get(sql, [email]);
      }
    
      async obtenerAllcontactos() {
        const sql = `SELECT * FROM contactos`;
        const all = promisify(this.db.all).bind(this.db);
        return await all(sql);
      }
    }
    
    


module.exports = ContactosModel