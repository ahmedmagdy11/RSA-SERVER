/**
 * @fileoverview This File is how to Encrypt data and send it to the server 
 * @Note I am gonna be using  Node - crypt native library when it comes to encrypting that data with - 
 * the public key 
 */

const axios = require("axios").default;
const crypto = require("crypto");
const fs = require("fs");

// STEP1 =========== Get public Key and store it in a file
async function getPublicAndStoreIt() {
    try {
        const public = await axios.get("http://localhost:5000/public?server=3");
        const public_key = public.data?.public_key;
        fs.writeFileSync("public_key.pem", public_key, { encoding: "utf-8" }, (err) => {
            if (err) {
                console.log(err);
            }
        });
    } catch (e) {
        console.log(e.message);
    }

}
// STEP2 =========== use public key to Encrypt the data 
//usually we will use this as a way to hash query paramters; 
function usePublicKeyToEncryptData() {
    const dataToBeEncrypted = "attributes=1,2,1,2,3,&values=1121232,3,,12312312313123123,1";
    // convert data to buffer 
    const bufferedData = Buffer.from(dataToBeEncrypted);
    const public_key = fs.readFileSync("public_key.pem", { encoding: "utf-8" }, (err) => {
        if (err) {
            console.log(err);
        }
    });
    const encryptedData = crypto.publicEncrypt(
        {
            key: public_key,
            oaepHash: "sha256",
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        bufferedData
    );
    return encryptedData.toString("base64");
}

function encryptDataWithpublicKey(public_key, data) {
    // convert data to buffer 
    const bufferedData = Buffer.from(data);
    const iterations = Math.ceil(bufferedData.length / 62);
    let encryptedData = "";
    for (let i = 0; i < iterations; i++) {
        encryptedData += crypto.publicEncrypt(
            {
                key: public_key,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            bufferedData.subarray(62 * i, 62 * (i + 1))
        ).toString("base64");
    }
    return encryptedData.toString("base64");
}

function decryptData(data, privateKey) {

    const iterations = data.length / 172;
    let decryptedData = "";
    console.log(iterations);
    for (let i = 0; i < iterations; i++) {
        const encryptedData = Buffer.from(data.substr(172 * i, 172 * (i + 1)), "base64");
        decryptedData += crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, encryptedData).toString("ascii");
    }
    return decryptedData;
}

// STEP3 =========== send the Encrypted data back to the server

// you might agree with a convention with your back-end developer to send back the data as 

//?query=encryptedData 

//But as of now we will send the encrypted data as {data : encryptedData}

async function sendEncryptedDataBackToserver(encryptedData) {
    try {
        await axios.post("http://localhost:5000/decrypt?server=3", { data: encryptedData }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

async function main() {
    // STEP1 
    await getPublicAndStoreIt();
    // STEP2
    const encryptedData = usePublicKeyToEncryptData();
    // STEP3   
    sendEncryptedDataBackToserver(encryptedData);

}




module.exports = { encryptDataWithpublicKey, decryptData }