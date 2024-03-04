const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    // Here you can process the uploaded file (req.file)
    // For example, you can rename it, move it, etc.
    res.sendStatus(200);
});

app.get('/download', (req, res) => {
    const file = path.resolve(__dirname, 'results-field.csv');
    res.download(file);
});

app.listen(3000, () => console.log('Server started on port 3000'));