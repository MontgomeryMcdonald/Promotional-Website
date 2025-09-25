import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const folder = path.join(__dirname, "..", 'data')
const file = path.join(folder, "data.json")



// Verify or Create file for before booting program
export async function ensureDataFile(){
    try {
        await fs.mkdir(folder,{recursive:true})
        await fs.access(file)
    } catch (error) {
        await fs.writeFile(file, "[]", "utf-8")
    }
}

// Read all students from json

export async function listData(){
    const rawData = await fs.readFile(file,"utf-8")
    try {
        return JSON.parse(rawData)
    } catch (err) {
        console.error(err)
        // in case the file is gone or corrupted, replace it.
        await fs.writeFile(file, "[]", "utf-8")
        return []
    }
}


// Validate Data
function dataValidation(input){
    const errors = []
    
    const firstName = String(input.firstName || "").trim()
    const lastName = String(input.lastName || "").trim()
    const email = String(input.email || "").trim()
    const newsletter = String(input.Newsletter == "on" ? true : false || "").trim()

    if(!firstName){errors.push("First Name required")}
    if(!lastName){errors.push("Last Name required")}
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){errors.push("Valid email is needed, sorry")}

    const capitalize = (s) => s.charAt(0).toUpperCase()+s.slice(1)

    return{
        firstName:capitalize(firstName),
        lastName: capitalize(lastName),
        email: email.toLowerCase(),
        isNewsletter: newsletter
    }
}
// Gen ID
function genID(){
    return (Date.now().toString(36)+Math.random().toString(36).slice(2,8).toUpperCase())
}

// adds new data to the json1
export async function addData(input){
    const cleanData = dataValidation(input)
    const newSubmission = {
        id: genID(),
        fullName:`${cleanData.firstName} ${cleanData.lastName}`,
        createdAt:  new Date().toISOString(),
        ...cleanData
    }

    const data = await listData()
    data.push(newSubmission)
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8")
    return newSubmission
}