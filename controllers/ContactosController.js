const ContactosModel = require("../models/ContactosModel");

class ContactosController {
  constructor() {
    this.ContactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async add(req, res) {
    
    
    const { email, name, mensaje } = req.body;
    
    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    
    const ip = req.ip;
    const fecha = new Date().toISOString();

   
    await this.ContactosModel.crearcontactos(email, name, mensaje, ip, fecha);


    
    res.redirect("/");
  }
}

module.exports = ContactosController;