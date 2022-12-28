require("dotenv").config();
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URI)
.then (() => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.error('error connetion MongoDB', error.message)
})