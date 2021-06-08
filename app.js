const express = require("express");
const app = express();


app.listen(process.env.PORT,()=>{
    console.log(`RSA Server is running on ${process.env.PORT}`)
});