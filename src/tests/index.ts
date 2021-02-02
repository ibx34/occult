import { Client } from "../lib/Client";

const client = new Client(process.env.token,"771")
client.connect()

client.on("ready", (data) => {
    const guilds = client.guilds.get("805987837555769384")
    console.log(guilds.name)
})