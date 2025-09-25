import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {ensureDataFile, listData, addData} from './utils/api.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5500

// Middleware timeee :3
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// static folder serving

app.use(express.static(path.join(__dirname, "public")))
ensureDataFile() // Makes sure the data file (students.json) exists when the project boots up.


// routes

app.get("/api/data", async (req, res, next) => {
    try {
        const data = await listData()
        res.status(200).json({count:data.length, data})
    } catch (err) {
        next(err)
    }
})

// API Routes
app.post("/api/data", async (req, res, next) => {
    try {
        const data = req.body
        const created = await addData(data)
        res.status(201).json({message:"Data Added: ", data:created})

    } catch (err) {
        next(err)
    }
})

app.use("/", (req, res) => {
    res.send("./public/index.html")
})


// 404 handler

app.use((req, res) => {
    res.status(404).json({error : "Server 404"})
})


// start servver
app.listen(5001, ()=>{
    console.log("server is listening on http://localhost:5000")
})