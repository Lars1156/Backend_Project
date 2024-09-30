const express = require('express');
const bodyParser = require('body-parser');
const {connection } = require('./connection')
const routerAPI = require('./router/api')
const app = express();

// database Connection

connection('mongodb://localhost:27017/books').then(()=>{
    console.log('Database Connection successfully');
}).catch((error)=>{
    console.error("Database Connection failed");
})

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', routerAPI);

app.listen(8081 , ()=>{
    console.log("Server is Running on port 8081");
})
