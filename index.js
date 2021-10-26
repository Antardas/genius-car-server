const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();

//MiddleWare
app.use(cors());
app.use(express.json());

// Database Conncect client confit
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mc60i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect();
        const database = client.db('mechanic');
        const servicesCollection = database.collection('services');
        console.log('Hitting the database');

        // Create Api
        app.post('/services', async (req, res) => {
            console.log('Hit the post api');
            const newService = req.body
            const result = await servicesCollection.insertOne(newService);
            res.json(result);
        });

        // Read Api
        app.get('/services', async (req, res) => {
            const cursor = await servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // Read Single Service 
        app.get('/services/:id', async (req, res) => {
            console.log('Hitting Specefic Id');
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            console.log(result)
            res.json(result);
        })

        // Update Product

        // delete api
        app.delete('/services/:id', async (req, res) => {
            console.log('Hitting delete services')
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
})
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Your are now on Root Path');
});

app.listen(port, (req, res) => {

    console.log('Lisenting Port:', port);
})