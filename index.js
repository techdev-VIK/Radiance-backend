const express = require('express');

const app = express();

const jwt = require('jsonwebtoken');


const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const SECRET_KEY = "supersecret";

const JWT_SECRET = "your_jwt_secret";

const {initializeDatabase} = require('./db/db.connect');

const Radiance = require('./models/radiance.models');


//middleware
app.use(express.json());

initializeDatabase();


const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token){
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(402).json({message: "Invalid Token"});
    }
}


app.post('/admin/login', (req, res) => {
    const {secret} = req.body;

    if(secret === SECRET_KEY){
        const token = jwt.sign({role: "admin"}, JWT_SECRET, {expiresIn: "24h"});

        res.json({token});
    }else{
        res.json({message: "Invalid Secret"})
    }
})


app.get('admin/api/data', verifyJWT, (req, res) => {
    res.json({message: "Protected route accessible"})
})


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



//Read by productType

async function readyByType(productType) {
    try {
        const readType = await Radiance.findOne({productType: productType});
        return readType;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.get('/product/type/:productType', async(req, res) => {
    try {
        const readByProType = await readyByType(req.body);

        if(readByProType){
            res.json(readByProType)
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

