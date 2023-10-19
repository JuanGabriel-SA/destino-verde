// Importando as dependências
const vision = require('@google-cloud/vision');
const multer = require('multer');
const storage = multer.memoryStorage();
const connection = require("../config/connection");
const upload = multer({ storage });
const fs = require('fs');
// Configurar um cliente da Google Cloud Vision
const client = new vision.ImageAnnotatorClient();
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const getImageInfo = app => {
    app.post('/get-image-info/:id', upload.single('image'), async (req, res) => {
        const fileExtension = req.file.originalname.split('.').pop();
        const filePath = `./imgs/img_user_${req.params.id}.${fileExtension}`;
        fs.writeFile(filePath, req.file.buffer, async (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar a imagem.');
            }
            const request = {
                image: { content: fs.readFileSync(filePath) },
            };
            const [results] = await client.objectLocalization(request);
            const objects = results.localizedObjectAnnotations;
            const queryPromises = objects.map(object => {
                return new Promise((resolve, reject) => {
                    connection.query(`SELECT * FROM materiais_reciclaveis WHERE material LIKE '%${object.name}%'`, (error, result) => {
                        if (error) {
                            reject(error);
                        } else if (result.length > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                });
            });

            const item = objects.map(item => item.name)[0];
            let translatedItem = null;

            try {
                const [translations] = await translate.translate(item, 'pt');
                const translation = Array.isArray(translations) ? translations[0] : translations;
                translatedItem = translation;
            } catch (error) {
                console.error('Ocorreu um erro na tradução:', error);
            }

            try {
                const resultsArray = await Promise.all(queryPromises);
                const anyResultsFound = resultsArray.includes(true);
                res.json(anyResultsFound ? { imageContent: translatedItem } : { imageContent: null });
            } catch (error) {
                console.error(error);
                res.status(500).send('Erro ao executar as consultas.');
            }
        });
    });
}

module.exports = { getImageInfo };