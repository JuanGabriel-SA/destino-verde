const connection = require("../config/connection");
const verifyJWT = require('../config/verifyToken');
const jwt = require('jsonwebtoken');

//Exportando para uso no server...
const newUser = app => {
    app.post('/new-user', (req, res) => {
        const data = req.body
        connection.query("INSERT INTO usuarios SET ?", data, (error, result) => {
            if (error)
                throw error
            else
                res.send(result);
        });
    });
}

const getUser = app => {
    app.get('/get-user/:id', (req, res) => {
        connection.query(`SELECT * FROM usuarios WHERE id = '${req.params.id}'`, (error, result) => {
            if (error)
                throw error
            else
                res.send(result);
        });
    });
}

const loginUser = app => {
    app.get('/login/:email/:password', (req, res) => {
        console.log('ovo')
        connection.query(`SELECT * FROM usuarios WHERE email = '${req.params.email}' 
        AND senha = '${req.params.password}'`, (error, result) => {
            if (error)
                throw error
            else
                res.send(result);
        });
    });
}

const verifyUser = app => {
    app.get('/verify-user/:email', (req, res) => {
        connection.query(`SELECT * FROM usuarios WHERE email = '${req.params.email}'`, (error, result) => {
            if (error)
                throw error
            else
                res.send(result);
        });
    });
}

const getToken = app => {
  app.get('/get-token/:id', (req, res) => {
          const id = req.params.id;  
          //Define o token de acesso as APIS...
          const token = jwt.sign({ id }, process.env.SECRET_KEY);
          return res.json(token);
  });
}

module.exports = { newUser, verifyUser, getUser, loginUser, getToken}


