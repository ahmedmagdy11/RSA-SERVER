const crypto = require("crypto");
const fs = require("fs");
const { deleteKeysJob } = require("./deleteKeysJob");


function generatePublicAndPrivateKeys(server_number) {
    try {
        if (typeof server_number == "number") {
            throw new Error("expected server_number to be a number");
        }
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 1024,
        });
        const public_key = publicKey.export({ format: "pem", type: "pkcs1" });
        const private_key = privateKey.export({ format: "pem", type: "pkcs1" });

        // if directory doesn't exist mkdir;
        // recursive option when the directory "keys" itself doesn't exist 
        !fs.existsSync(`keys/${server_number}`) ? fs.mkdirSync(`keys/${server_number}`, { recursive: true }) : null;

        fs.writeFileSync(`keys/${server_number}/public_key.pem`, public_key, { encoding: "utf-8" });
        fs.writeFileSync(`keys/${server_number}/private_key.pem`, private_key, { encoding: "utf-8" });
        const TimeToDeleteFiles = new Date();
        // tweak this number from env variables as you wish i suggest keeping at 1 to 3 days range
        deleteKeysJob(TimeToDeleteFiles.setDate(TimeToDeleteFiles.getDate() + process.env.DAYS_TO_EXPIRE), server_number);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

function getkey(server_number, keyType = "public") {
    try {
        if (typeof server_number == "number") {
            throw new Error("expected server_number to be a number");
        }
        console.log("server number: " + server_number);
        console.log("key_type:" + keyType);
        // if key doesn't exist generate it :)
        // also the request must be coming for public keys => can't request private before public
        const fileExists = fs.existsSync(`keys/${server_number}/${keyType}_key.pem`)
        if (!fileExists && keyType == "public") {
            console.log("Directory doesnt exist")
            if (!generatePublicAndPrivateKeys(server_number)) {
                // Throw an Error incase of failure;
                throw new Error("Failed to generate keys");
            }
        }
        const key = fs.readFileSync(`keys/${server_number}/${keyType}_key.pem`, { encoding: "utf-8" });
        return key;
    } catch (e) {
        console.log(e);
        return null;
    }
}
module.exports = {
    generatePublicAndPrivateKeys,
    getkey
}