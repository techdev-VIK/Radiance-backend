const express = require('express');

const app = express();


const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const {intializeDatabase} = require('./db/db.connect');

const Radiance = require('./models/radiance.models');


//middleware
app.use(express.json());

intializeDatabase();


app.get('/', async(req, res) => {
    res.send('Welcome to Radiance Web Application!')
});


//create a new product;

async function createRadiance(newRadiance) {
    try {
        const radiance = new Radiance(newRadiance);
        await radiance.save();
        return radiance;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.post('/createRadiance', async(req, res) => {
    try {
        const savedRadiance = await createRadiance(req.body);
        res.status(200).json({message: 'Product added successfully!', radiance: savedRadiance});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to add product'})
    }
})


//Read all products:

async function readProducts() {
    try {
        const readAll = await Radiance.find();
        return readAll;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.get('/allProducts', async(req, res) => {
    try {
        const readAll = await readProducts();
        if(readAll){
            res.json(readAll)
        }else{
            res.status(404).json({error: 'Failed to find products.'})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data.'})
    }
})


//Read by ProductName

async function readyByName(productName) {
    try {
        const readByName = await Radiance.findOne({productName: productName});
        return readByName;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.get('/product/:productName', async(req, res) => {
    try {
        const readByProName = await readyByName(req.body);

        if(readByProName){
            res.json(readByProName)
        }else{
            res.status(404).json({error: 'Failed to find products.'})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data.'})
    }
})




const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

