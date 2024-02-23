const { response } = require('express');
const express = require('express')
const studentRouter = require("./src/students/routes")
const app = express()
const PORT = 4000;
app.use(express.json());
app.listen(PORT, () => console.log(`app is listening at ${PORT}`))

app.get('/', (request, response) => {
    response.send("Hello raj")
})

app.use("/api/v1/students", studentRouter)


