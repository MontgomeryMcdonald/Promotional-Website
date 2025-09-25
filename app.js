import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import {ensureDataFile, listData, addData} from './utils/api.js'


let ID = ""

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

let username = "Monte123"
let password = "abc123supersecret"

app.post("/api/login", async (req, res, next) => {
    try {
        const data = req.body
        console.log("try reached")
        if(data.username == username && data.password == password){
            console.log("tests passed. sending data")
            ID = (Date.now().toString(36)+Math.random().toString(36).slice(2,8).toUpperCase())
            res.redirect(`http://localhost:5000/${ID}`)
        }else{
            console.log("tests failled")
            res.redirect("http://localhost:5000/")
        }
    } catch (err) {
        next(err)
    }
})

async function compileData(){
    let data = await listData()
    let output = ""
    for(let item of data){
        output += `
        <hr>
        <h2>${item.fullName}</h2>
        <p>${item.createdAt}</p>
        <p>${item.id}</p>
        <p>${item.email}</p>
        `
    }
    console.log(output)
    return output
}




app.use(`/${ID}`, async (req, res) => {
    
    console.log("redirect successfull. sending data")
    res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <link rel="apple-touch-icon" sizes="180x180" href="./images/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./images/favicon/favicon-16x16.png">
</head>
<body>

    <nav>
        <h1>Prism Launcher</h1>
        <a href="./index.html">Home</a>
    </nav>

    <main>
        <article>
            <h1>Admin Panel</h1>
            ${await compileData()}
        </article>
    </main>
    <footer>
        <h1>Prism Launcher</h1>
    </footer>
</body>
</html>
`)
})

app.use("/", (req, res) => {
    res.send("./public/index.html")
})


// 404 handler

app.use((req, res) => {
    res.status(404).json({error : "Server 404"})
})


// start servver
app.listen(5000, ()=>{
    console.log("server is listening on http://localhost:5000")
})