const express = require("express");
const router = require("./router/router");
const app = express();

app.use(express.json());
app.use(router);
app.listen(process.env.PORT || 5000,()=>{
    console.log(`RSA Server is running on ${process.env.PORT || 5000}`)
});


