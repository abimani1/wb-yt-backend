const express = require("express");
const app = express();
const cors = require("cors");
const Dbconnection = require("./db/dbConnection");
const userRouter = require ("./routers/user.router")
const downloadServices = require ("./routers/youTube.router")
const PORT = 4000
app.use(cors())
app.use(express.json()); 

app.use("/v1/api/user", userRouter)
app.use("/v1/api/download", downloadServices)

Dbconnection()

app.listen(PORT,()=>{
    console.log("server connection");
})
