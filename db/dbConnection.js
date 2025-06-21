const mongoose = require("mongoose");

async function Dbconnection() {
    let connectDB = await mongoose.connect("mongodb://localhost:27017/node-app",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then((res)=>{
        console.log("Database Connected");
    }).catch((error)=>{
        console.log("Connection Failed");
    })
}

module.exports = Dbconnection