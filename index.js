const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware 

app.use(cors());
app.use(express.json());

// user: Rasel 
// Pass: d0TQVuUcJHpaCPSX



const uri = "mongodb+srv://Rasel:d0TQVuUcJHpaCPSX@cluster0.ak2s5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const notesCollections = client.db("NoteTraker").collection("notes");

        // get api to read all notes
        // http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const query = req.query;
            console.log(query);
            const cursor = notesCollections.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // create notesTaker
        // http://localhost:5000/note

        /* body 
        {
            "_id": "6266dc52a18658ecba3b4b5f",
            "username": "Rasel",
            "email": "azad.is.rasel@gmail.com"
            }, */

        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await notesCollections.insertOne(data);
            res.send(result);
        })

        // update notes
        // http://localhost:5000/note/6266e435050fba95c776f9a7
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("from put method", data);
            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // same as userName and texData 
                    // ...data
                    userName: data.userName,
                    textData: data.textData
                },
            };
            const result = await notesCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // delete notes
        // http://localhost:5000/note/6266e435050fba95c776f9a7
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await notesCollections.deleteOne(query);
            res.send(result);
        })

    }

    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running Note Tracker");
})

app.listen(port, () => {
    console.log("Lisening the port", port)
})