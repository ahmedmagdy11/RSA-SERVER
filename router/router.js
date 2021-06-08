const {Router} = require("express");
const {publicKey, privateKey} = require("../generateKeys");
const router = Router();

router.get("/public",(req,res)=>{
    try{
        const key = publicKey.export({
            format: "pem",
            type : "pkcs1"
        });
        return res.send({
            public_key:  key
        }); 
    }catch(e){
        res.status(500).send({message: "Something went wrong while generating the key"});
    }

});

router.post("/decrypt",(req,res)=>{
    try{
        const data = req.body.data;
        //decrypt data and send it
    }catch(e){
        res.status(400).send({message : "Something went wrong while deccrypting the data"});
    }   
});
module.exports = router;