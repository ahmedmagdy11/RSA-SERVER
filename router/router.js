const {Router} = require("express");
const {getkey} = require("../generateKeys");
const crypto = require("crypto");
const router = Router();


/**
 * @todo Finish the decryption part 
 * @todo Add CronJob to generate new keys every 3 or 2 days;
 * @todo Add public and private key to each server
 */
router.get("/public",(req,res)=>{
    try{
        const server_number = req.query.server;
        if (!server_number){
            throw new Error("expected server number");
        } 
        const key = getkey (server_number, "public"); 
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
        if (!data) {
            throw new Error("Data doesn't exist");
        }
        const encryptedData = Buffer.from(data,"base64");
        const server_number = req.query.server; 
        if (!server_number){
            throw new Error("expected server number");
        }
          
        const privateKey = getkey(server_number, "private");

        if (!privateKey){
            throw new Error(`Server ${server_number} doesn't have keys`);
        }

        const decryptedData = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, encryptedData);
        console.log(decryptedData.toString("ascii"));
        return res.sendStatus(200);
    }catch(e){
        console.log(e.message);
        res.status(400).send({message : "Something went wrong while decrypting the data"});
    }   
});
module.exports = router;