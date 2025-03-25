const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'out')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur local démarré sur http://localhost:${port}`);
}); 