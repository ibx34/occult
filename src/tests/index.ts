import { Client } from "../lib/Client";
import { User } from "../lib/Structures/User";
import Utl from "util"
require("dotenv").config()

const client = new Client(process.env.token.toString(),{
    intents: "771",
    prefix: "!",
    ignoreBots: true
})
client.setStatus("online",{
    activity: "streaming",
    name: "dark is a nerd",
    url: "https://twitch.tv/#"
})

client.connect()

client.on("ready", (bot) => {
    console.log(`${bot.fullname} is online!`)
})

client.on("message", async(message) => {
    if (message.author.bot) return
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.content === "!add_cool"){
        message.guild.addRole("805996141417463838",message.author.id,"Wanted the cool role.")
        return message.channel.send(`${message.author.username} I added the cool role to you!`)
    }
    if (message.content === "!remove_cool"){
        message.guild.removeRole("805996141417463838",message.author.id,"Removed the cool role.")
        return message.channel.send(`${message.author.username} I removed the cool role from you!`)
    }
    if (cmd){
        if (cmd.toLowerCase() === "roles"){
            return message.channel.send(`User: ${message.mentions.first}`)
        }
        if (cmd.toLowerCase() === "kick"){
            const guild = client.guilds.get(message.guild.id)
            let member

            for (const m of guild['members']){
                if (m['user']['id'] == args[0]){
                    member = new User(m['user'],client)
                }
            }
            if (!member){
                return message.channel.send("That isn't a member :/")
            }
            let reason = args.slice(1).join(" ")
            if (!reason) reason = "No reason provided."
            
            message.guild.kick(member['id'],reason)
            return message.channel.send(`Kicked ${member.fullname}`)
        }    
        if (cmd.toLowerCase() === "info"){
            message.member.removeRole("805996141417463838")
            return message.channel.send(message.member.fullname + " " + message.member.id)
        }
        if (cmd.toLowerCase() === "mentions"){
            return message.channel.send(`The first mention here was: **${message.mentions.first.username}** (\`${message.mentions.first.id}\`)`)
        }
        if (cmd.toLowerCase() === "fetch"){
            const user = await client.fetchUser(args[0])
            return message.channel.send(`**User fetched.**\n${user.username} (\`${user.id}\`)`)
        }
        if (cmd.toLowerCase() === "eval"){
            if (message.author.id != "366649052357591044")return

            const args2=args.join(" ")
            const evaled = eval(args2)
            const sendMe = Utl.inspect(evaled)
            message.channel.send(sendMe.toString())
        }
    }
})