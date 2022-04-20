const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const axios = require("axios")
const hbs = require("hbs");
require("../src/db/connection")
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")
//const User = require("./models/registers")
const Register = require("../src/models/registers");
const { application } = require("express");
const res = require("express/lib/response");
const async = require("hbs/lib/async");

app.set("view engine", "hbs")
app.use(express.static(static_path));
app.set("views", template_path)
hbs.registerPartials(partials_path)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))//important line
app.use(express.urlencoded({extended:false}))

app.get("/", async(req, res) => {

    try{

        const response = await axios.get('http://localhost:3000/user');
        
        res.render("index",{user: response.data,listExists: true})
       
    }catch(err)
    {
        res.send(err)
    }
})

app.get("/add-user", (req, res) => {

    res.render("adduser")
})


app.get("/updateuser", async(req, res) => {

    axios.get('http://localhost:3000/user',{params:{id:req.query.id}})
    .then(function(userdata){

       
        res.render("updateuser",{getUser : userdata.data})
      
    }).catch(err=>{
        res.send(err)
    })

 
})

app.post("/edituser/:id",async(req,res)=>{

    try {

        const id = req.params.id;

        const sData = await Register.findByIdAndUpdate({_id:id},req.body,{new:true })
        console.log(sData)

        if (!sData) {
            return res.status(404).send()
        }
        else {

            res.status(200).redirect("/")
        }

    }
    catch (e) {
        res.send({ message: "Error update user information" });
    }


})

app.post("/user", async (req, res) => {


    //validate the request

    if (!req.body) {
        res.status(404).send({ message: "Content can't be empty" });
        return;
    }
    try {

        const registerUser = new Register({

            fullname: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone
        })

        const result = await registerUser.save();
        res.status(201).redirect("/")


    } catch (err) {
        res.status(404).send(err);

    }



})

app.get("/delete/:id",async(req,res)=>{

    try {
 
        const id = req.params.id;

        const delData = await Register.findByIdAndDelete({_id:id});

        if (!id) {
            return res.status(404).send();
        }


        res.status(200).redirect("/")





    }
    catch (e) {
        res.status(404).send(e);
    }



})

app.get("/user", async (req, res) => {

    try {

        if (req.query.id) {
            const id = req.query.id;

            const info = await Register.find({_id:id});
            res.send(info)
        }
        else {

            const info = await Register.find();
            res.send(info);
        }



    } catch (err) {
        res.status(500).send(err)
    }
})


app.listen(port, () => {

    console.log(`Server is running at ${port}`)
})