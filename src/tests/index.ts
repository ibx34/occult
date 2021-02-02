import { Client } from "../lib/Client";
require("dotenv").config()

const client = new Client(process.env.token.toString(),"771")
client.connect()

client.on("ready", (data) => {
    console.log("Online")
})