const path = require('path');
const http = require('http');
const express = require('express');
// const { ppid } = require('node:process');

const app=express();

//Set Static Folder

app.use(express.static(path.join(__dirname,'public')));

const PORT = process.env.PORT||3000;

app.listen(PORT,()=>console.log(`Server running on port : ${PORT}`));