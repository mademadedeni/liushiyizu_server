const Users = require("../model/users.js");
const Secret = require("../model/secret.js");
const uuidv5 = require("uuid/v5");
const config = require("../config");
async function syncTable(ctx, next) {
    await Users.sync().catch((err)=>{
        console.log(err);
    });
    await Secret.sync().catch((err)=>{
        console.log(err);
    });
    const user = Users.build({
        id: uuidv5(config.uuid, uuidv5.DNS),
        name: "Jane",
        gender: 1
    });
    var res = await user.save();
    ctx.body = JSON.stringify({res:res})
}

module.exports = {
    syncTable
}