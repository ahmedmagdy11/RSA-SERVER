const { Router } = require("express");
const { getkey } = require("../generateKeys");
const { encryptDataWithpublicKey, decryptData } = require("../sendEncryptedDataExample");
const router = Router();


/**
 * @todo Add CronJob to generate new keys every 3 or 2 days;
*/
router.get("/public", (req, res) => {
    try {
        const server_number = req.query.server;
        if (!server_number) {
            throw new Error("expected server number");
        }
        const key = getkey(server_number, "public");
        return res.send({
            public_key: key
        });
    } catch (e) {
        res.status(500).send({ message: "Something went wrong while generating the key" });
    }

});

router.post("/decrypt", (req, res) => {
    try {
        const data = req.body.data;
        if (!data) {
            throw new Error("Data doesn't exist");
        }
        const server_number = req.query.server;
        if (!server_number) {
            throw new Error("expected server number");
        }

        const privateKey = getkey(server_number, "private");

        if (!privateKey) {
            throw new Error(`Server ${server_number} doesn't have keys`);
        }
        const decryptedData = decryptData(req.body.data, privateKey);
        res.send({ data: decryptedData });

    } catch (e) {
        console.log(e.message);
        res.status(400).send({ message: "Something went wrong while decrypting the data" });
    }
});


router.post("/encrypt", async (req, res, next) => {
    try {
        const public_key = req.body.public_key;
        const data = req.body.data;
        const encryptedData = encryptDataWithpublicKey(public_key, data);

        console.log(encryptedData);
        res.send({ data: encryptedData });
    } catch (e) {
        console.log(e.message);
        res.status(400).send({ message: "Something went wrong while decrypting the data" });
    }
})
module.exports = router;