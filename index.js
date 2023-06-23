const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

// mongodb start


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ectfhk2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const toy_car = client.db("toy_car");
    const carCollection = toy_car.collection("carData");

    app.get('/', (req, res) => {
      res.send("Toys Car site server is open");
    })

    app.get('/carData', async (req, res) => {
      // const query = req.query.category;

      let query = {};

      if(req.query.category){
        query = { category : req.query.category};
      }

      const cursor = carCollection.find(query);
      const result = await cursor.toArray();
      
      res.send(result);

      // console.log(query);

    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// mongodb ends




app.listen(port, () => {
  console.log("Server in background successfully running");
})