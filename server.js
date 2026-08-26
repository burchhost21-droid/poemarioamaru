const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

// Servir archivos estáticos desde la raíz, pero sin servir index automáticamente
app.use(express.static(__dirname, { index: false }));

// Ruta principal: forzar index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== CONTENIDO DEL LIBRO ==========
// (aquí va todo el array libroData que ya tenés)

// ========== RUTAS API ==========
app.get('/api/libro', (req, res) => {
  res.json(libroData);
});

app.get('/api/config', (req, res) => {
  res.json({
    alias: process.env.MP_ALIAS || 'amaru77mp',
    donationLink: process.env.MP_DONATION_LINK || 'https://mpago.la/ejemplo'
  });
});

app.get('/api/descargar-pdf', (req, res) => {
  // (tu código de PDF)
});

// Cualquier otra ruta (para el SPA) también sirve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
