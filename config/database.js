// import the mongoose library
const mongoose = require('mongoose')

// storing connection string in a variable - for testing
const connectionString = process.env.DATABASE_URL 

// establish our mongoose connection
mongoose.connect(connectionString)

// reference the current connection
const db = mongoose.connection

// connection event listeners
db.on('connected', function(){
    console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
})

// connection event listeners
db.on('error', function(err){
    console.log('something went wrong')
})