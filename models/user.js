const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/techtoon?retryWrites=true&w=majority")
const db = mongoose.connection

const bcrypt = require('bcrypt')


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://tahmid:<password>@test1.mbzeo.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



//user schema
const userSchema = {
    name: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
}


const User = module.exports = mongoose.model('User', userSchema)

module.exports.createUser = (newUser, callback) => {
    let salt = Math.floor(Math.random() * 10)
    bcrypt.hash(newUser.password, salt, (err, hashPass) => {
        if(err) throw err
        newUser.password = hashPass

        //save the user
        newUser.save(callback)
    })
}

module.exports.findUserByUsername = (username, callback) => {
    let query = {username: username} // the query to find username
    User.findOne(query, callback) // this method find with the query
}

module.exports.findUserById = (id, callback) => {
    User.findById(id, callback)
}

module.exports.comparePassword = (candidatePassword, hashPass, callback) => {
    bcrypt.compare(candidatePassword, hashPass, (err, isMatch) => {
        if(err){
            return callback(err)
        }
        return callback(null, isMatch)
    })
}

