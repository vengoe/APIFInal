const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const { nanoid } = require("nanoid");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors()); //Allows us to make requiests from our game.
app.use(bodyParser.json());


//Connection for MongoDB
mongoose.connect("mongodb+srv://michaelvengoe:Laugh!913@cluster0.lawpp.mongodb.net/PlayersDB");//"mongodb://localhost:27017/gamedb");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

// Get all players sorted alphabetically
app.get("/", async (req, res) => {
    try {
        const players = await User.find().sort({ name: 5 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve players" });
    }
});
  

app.get("/user", async (req,res)=>{
    try{
        const user = await User.find();
        if(!user){
            return res.status(404).json({error:"users not found"});
        }

        res.json(user);
        console.log(user);
    }
    catch(error){
        res.status(500).json({error:"Failed to retrieve users"})
    }
});

// Get player by screen name
app.get("/user/:name", async (req, res) => {
    try {
        const user = await Player.findOne({ name: new RegExp(`^${req.params.name}$`, "i") });

        if (!user) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve player" });
    }
});
app.get("/user/:userid", async(req,res)=>{
    console.log(req.params.userid);
    try{

        const user = await User.findOne({userid:req.params.userid});

        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user);

    }
    catch(error)
    {
        res.status(500).json({error:"Failed to retrieve user"})
    }
});


// app.get("/user/:name", async(req,res)=>{
//     console.log(req.params.name);
//     try{

//         const user = await User.findOne({name:req.params.name});

//         if(!user){
//             return res.status(404).json({error:"user not found"})
//         }
//         res.json(user);

//     }
//     catch(error)
//     {
//         res.status(500).json({error:"Failed to retrieve user"})
//     }
// });
app.post("/sentdata", (req,res)=>{
    const newUserData = req.body;

    console.log(JSON.stringify(newUserData,null,2));

    res.json({message:"User Data recieved"});
});

app.post("/sentdatatodb", async (req,res)=>{
    try{
        const newUserData = req.body;

        console.log(JSON.stringify(newUserData,null,2));

        const newUser = new User({
            userid: nanoid(8),
            name:newUserData.name, 
            gamesplayed:newUserData.gamesplayed,
            score:newUserData.score
        });
        
        
        //save to database
        await newUser.save();
        res.json({message:"User Added Successfully",userid:newUser.userid, name:newUser.name});
    }
    catch(error){
        res.status(500).json({error:"Failed to add user"})
    }
    
    
});


// Edit player data
app.put("/user/:userid", async (req, res) => {
    try {
        const { name, gamesplayed, score } = req.body;
        const updatedPlayer = await User.findOneAndUpdate(
            { userid: req.params.userid },
            { name, gamesplayed, score },
            { new: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ error: "Player not found" });
        }

        res.json({ message: "Player updated successfully", user: updatedPlayer });
    } catch (error) {
        res.status(500).json({ error: "Failed to update player" });
    }
});

// Delete player
app.delete("/user/:userid", async (req, res) => {
    try {
        const deletedPlayer = await User.findOneAndDelete({ userid: req.params.userid });
        if (!deletedPlayer) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete player" });
    }
});

  app.listen(3000, ()=>{
    console.log("Running on port 3000");
})