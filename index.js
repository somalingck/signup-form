const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.kvpy31k.mongodb.net/signupFormDB`, {
    // Removed deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

const signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const signup = mongoose.model("signup", signupSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser=await signup.findOne({email : email});
        if(!existingUser){
            const signupData = new signup({
                name,
                email,
                password,
            });
    
            await signupData.save();
            res.redirect("/success");
        }
        else{
            console.log("User alredy exist");
            res.redirect("/error")
        }
        const signupData = new signup({
            name,
            email,
            password,
        });

        await signupData.save();
        res.redirect("/success");
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/view/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
