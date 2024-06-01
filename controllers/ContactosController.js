require('dotenv').config();
const ContactosModel = require("../models/ContactosModel");
const nodemailer = require ('nodemailer');
const EMAILUNICO = process.env.EMAILUNICO;
const EMAILPRUEBA = process.env.EMAILPRUEBA;
const EMAILS1 = process.env.EMAILS1;
const EMAILS2 = process.env.EMAILS2;

console.log(EMAILUNICO,EMAILS1,EMAILS2,EMAILPRUEBA);

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAILUNICO,
        pass: EMAILPRUEBA
      }
    });
  }

   //funcion enviar correo
   enviarCorreo(email, nombre, mensaje, EMAILUNICO, EMAILS1, EMAILS2) {
    const mailOptions = {
      from: EMAILUNICO,
      to: [EMAILS1, EMAILS2], // Agrega más destinatarios si es necesario
      subject: 'Nuevo registro de usuario',
      text: 'Nombre: '+nombre+'\nEmail: '+email+'\nMensaje: '+mensaje
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ${info.response}');
      }
    });
  }
// fin funcion enviar correo



  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Retorna la ip
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; // Retorna null si hay un error
    }
  }

  async obtenerPais(ip) {
    try {
      const response = await fetch('https://ipinfo.io/'+ip+'?token=e5401e11d736bc');
      const data = await response.json();
      return data.country; // Retorna el país
    } catch (error) {
      console.error('Error al obtener el país:', error);
      return null; // Retorna null si hay un error
    }
  }

  
  
  async add(req, res) {
    // Validar los datos del formulario
      const { name, email, mensaje } = req.body;
  
  

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip);

      await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

      const contactos = await this.contactosModel.obtenerAllContactos();

      await this.enviarCorreo(email, name, mensaje, EMAILUNICO, EMAILS1, EMAILS2);
  
      console.log(contactos);
  
      // Enviar mensaje de confirmacion
      res.send("Tus Datos fueron enviados con exito.");
    }
  }

module.exports = ContactosController;