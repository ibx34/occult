import { Client } from "../lib/Client";

const client = new Client("ODA1OTg3OTQ3NjE4NzYyNzUy.YBi4xQ.4DlzKnAB2slQaDZsJ2iKC0dnbbY","771")
client.connect()

client.on("ready", (data) => {
    const guilds = client.guilds.get("805987837555769384")
    console.log(guilds.name)
})