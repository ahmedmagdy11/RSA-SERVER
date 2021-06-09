module.exports = { 
    decodedBase64 
}

function decodedBase64(base64String){
    const buffered = Buffer.from(base64String,"base64");
    const text = buffered.toString("ascii");   
    return text;
}