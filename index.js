const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.voxe2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  
  try {
    await client.connect();
    const database = client.db("classicTourismPark");
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('orders');

    // GET API for all services
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET API for all orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // GET API for a single service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
  });

  // POST API for services
    app.post('/services', async (req, res) => {
      const service = req.body;

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

  // POST API orders
    app.post('/orders', async (req, res) => {
      const order = req.body;

      const result = await ordersCollection.insertOne(order);
      console.log(result);
      res.json(result)
    });

  // my orders
  app.get("/myOrders/:email", async (req, res) => {
    const result = await ordersCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

  // DELETE API for services at manage service page
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

  // DELETE API for my orders
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

  // DELETE API for orders
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

  
  }
  finally {
    // await client.close();
  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running classic tourism park server');
});

app.listen(port, () => {
  console.log('Running classic tourism park server on port', port);
})