const express = require('express')
const app = express()

const mongoss= require('mongodb')


app.addListener(3000, () => {
    console.log("connected to server!");
})