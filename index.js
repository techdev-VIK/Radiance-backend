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

// const SECRET_KEY = "supersecret";

const JWT_SECRET = "your_jwt_secret";

const {initializeDatabase} = require('./db/db.connect');

const Radiance = require('./models/radiance.models');

const RadianceUsers = require('./models/users.models');


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


app.post('/admin/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await RadianceUsers.findOne({username});

        if(!user){
            return res.status(404).json({message: "User not found."})
        }


        if(user.password !== password){
            return res.status(401).json({message: "Invalid Password"})
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "24h"});

        res.json({token, message: "Login Success"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error", error})
    }
})


app.get('admin/api/data', verifyJWT, (req, res) => {
    res.json({message: "Protected route accessible"})
})



// get all users of radiance

async function readUsers() {
    try {
        const readAll = await RadianceUsers.find();
        return readAll;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.get('/users/readAll', async (req, res) => {
    try {
        const readAll = await readUsers();

        if(readAll){
            res.json(readAll)
        }else{
            res.status(404).json({error: 'Failed to get users'})
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
})


//get by username

async function readByUsername(username){
    try {
        const readUser = await RadianceUsers.findOne({username});

        return readUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



app.get('/users/read/:username', async(req, res) => {
    try {
        const readUsername = await readByUsername(req.params.username);

        if(readUsername){
            res.json(readUsername)
        }else{
            res.status(401).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(500).json({error})
    }
})


// Create user of radiance


async function createUser(user) {
    try {
        const newUser = new RadianceUsers(user);
        await newUser.save();
        return newUser
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.post('/users/createNew', async(req, res) => {
    try {
        const {username} = req.body;

        const userExists = await RadianceUsers.findOne({username});

        if(userExists){
            return res.status(409).json({error: "This username Exists already, please pick a new one."})
        }

        const newUser = createUser(req.body);
        res.status(200).json({message: 'User added successfully!', user: newUser});
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
});


//update an exisitng user:

async function updateUser(userId, dataToUpdate) {
    try {
        const editUser = await RadianceUsers.findByIdAndUpdate(userId, dataToUpdate, {new: true});

        return editUser;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.post('/user/edit/:userId', async(req, res) => {
    try {
        const editedUser = await updateUser(req.params.userId, req.body);

        if(editedUser){
            res.status(200).json({message: 'Data updated successfully', editedUser})
        }else{
            res.status(404).json({error: 'Failed to update the user.'})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update data."})
    }
})


async function deleteAddress(username, addressType) {
    try {
        const update = {};
        update[addressType] = 1;

        const deleteAddress = await RadianceUsers.findOneAndUpdate({username: username}, {$unset: {[addressType] : ""} }, {new: true});

        return deleteAddress;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.post('/delete/:username', async(req, res) => {
    try {

        const {secondaryAddress} = req.body;

        
        const deletedAddress = deleteAddress(req.params.username, secondaryAddress);

        if(deletedAddress){
            res.status(200).json({message: "Address Deleted", deletedAddress})
        }else{
            res.status(404).json({error: "Failed to Delete Address."})
        }

    } catch (error) {
        res.status(500).json({error: "Failed to delete address."})
    }
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

