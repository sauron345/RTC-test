import express from 'express'
import * as fs from "node:fs";

const app = express()
const port = 4000;

const encodedEventStateStr = fs.readFileSync('./src/api_emulator/resources/encoded_events_data.json', 'utf8')
const mappingsDataStr = fs.readFileSync('./src/api_emulator/resources/mappings_storage.json', 'utf8')

let encodedEventsState = JSON.parse(encodedEventStateStr)
let mappingsData = JSON.parse(mappingsDataStr)

app.use(express.json())

app.post('/client/state', (req, res) => {
    console.log('Received data:', JSON.stringify(req.body))
})

app.post('/api/state',
    (req, res) => {
        res.json(encodedEventsState)
})

app.post('/api/mappings',
    (req, res) => {
        res.json(mappingsData)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.get('/active', (req, res) => {
    res.status(200).send("OK");
});
