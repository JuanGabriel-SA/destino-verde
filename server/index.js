const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();

//Cors permitindo acesso ao consumo das APIS...
app.use(cors({
    credentials: true,
    //Trocar origin de acordo com a url do FRONT-END...
    origin: ['http://localhost:3000']
}));

const cookieParser = require('cookie-parser');
const { getUser, newUser, verifyUser, loginUser } = require('./api/userAPI');
require('dotenv').config();

app.use(express.json({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// --> ROTAS <-- //
getUser(app);
newUser(app);
verifyUser(app);
loginUser(app);
// --> ROTAS <-- //

const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`))

