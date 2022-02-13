const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 7000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vj9mo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    const database = client.db("dbGlasses");
    const productsCollection = database.collection("products");
    
    // PRODUCTS POST API
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
      console.log(product);
      console.log(result);
    })

    // PRODUCTS GET API
    app.get('/products', async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.json(result);
    })

    // SINGLE PRODUCTS GET API
    app.get('/products/details/:productId', async (req, res) => {
      const id = req.params.productId;
      const query = {_id: ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.json(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})