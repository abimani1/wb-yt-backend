const express = require("express");
const app = express();
const cors = require("cors");
const downloadServices = require ("./routers/youTube.router")
const PORT = process.env.PORT || 4000
app.use(cors())
app.use(express.json()); 

app.use("/v1/api/download", downloadServices)


app.listen(PORT,()=>{
    console.log("server connection");
})
