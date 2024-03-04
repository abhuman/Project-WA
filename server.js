const express = require('express');
const multer = require('multer');
const csvWriter = require('csv-writer');
const fs = require('fs');
const path = require('path');
const { apiRequest } = require('./api-request');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
    const { url } = req.body;
    const response = await apiRequest(url, 'desktop');

    const labData = response.lighthouseResult.audits;
    const fieldData = response.loadingExperience.metrics;

    const labWriter = csvWriter.createObjectCsvWriter({
        path: 'public/results/results-field.csv',
        header: Object.keys(labData[0]).map(key => ({ id: key, title: key }))
    });

    const fieldWriter = csvWriter.createObjectCsvWriter({
        path: 'public/results/results-test.csv',
        header: Object.keys(fieldData[0]).map(key => ({ id: key, title: key }))
    });

    await labWriter.writeRecords(labData);
    await fieldWriter.writeRecords(fieldData);

    res.redirect('/');
});

app.post('/upload', upload.single('csv'), async (req, res) => {
    const csvFilePath = req.file.path;
    const csvData = fs.readFileSync(csvFilePath, 'utf8').split('\n');

    for (let url of csvData) {
        const response = await apiRequest(url, 'desktop');

        const labData = response.lighthouseResult.audits;
        const fieldData = response.loadingExperience.metrics;

        const labWriter = csvWriter.createObjectCsvWriter({
            path: `public/results/${url}-field.csv`,
            header: Object.keys(labData[0]).map(key => ({ id: key, title: key }))
        });

        const fieldWriter = csvWriter.createObjectCsvWriter({
            path: `public/results/${url}-test.csv`,
            header: Object.keys(fieldData[0]).map(key => ({ id: key, title: key }))
        });

        await labWriter.writeRecords(labData);
        await fieldWriter.writeRecords(fieldData);
    }

    fs.unlinkSync(csvFilePath); // delete the uploaded CSV file

    res.redirect('/');
});

app.listen(3000, () => console.log('Server started on port 3000'));