const schedule = require('node-schedule');
const fs = require("fs");
async function deleteKeysJob(TimeToDeleteFile, server_number) {
    console.log("time to delete files = " + new Date(TimeToDeleteFile));
    try {
        if (isNaN(new Date(TimeToDeleteFile))) {
            throw new Error("Invalid date");
        }
       
        const public_path = `keys/${server_number}/public_key.pem`;
        const private_path = `keys/${server_number}/private_key.pem`;
        const publicKeyExists = fs.existsSync(public_path);
        const privateKeysExists = fs.existsSync(private_path);
        if (!publicKeyExists || !privateKeysExists) {
            throw new Error("keys doesn't exist");
        }
        schedule.scheduleJob(new Date(TimeToDeleteFile), function () {
            try {
                fs.unlinkSync(public_path);
                fs.unlinkSync(private_path);
            } catch (e) {
                console.log(e);
            }

        });
    } catch (e) {
        console.log(e);
    }

}



module.exports = { deleteKeysJob }