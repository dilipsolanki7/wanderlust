// https://www.passportjs.org/packages/
// https://www.npmjs.com/package/passport
// https://www.npmjs.com/package/passport-local-mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email :{
        type: String,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);