import ws from "ws"
import axios from "axios"
import eventEmitter from "eventemitter3";
import { Guilds } from "./Guilds";
import { Message } from "./Structures/Messsage";
import { User } from "./Structures/User";

interface botOptions {
    prefix: string
    intents: string
    ignoreBots?: boolean
}

export class Client extends eventEmitter {
    token: string
    heartbeat_ms: number;
    intents: string;
    socket: ws;
    ready = false
    guilds = new Guilds()
    prefix: string;
    ignoreBots: boolean = true;

    constructor(token: string, options: botOptions) {
        super()

        this.token = token
        this.intents = options.intents
        this.prefix = options.prefix
        this.ignoreBots = options.ignoreBots
        this.socket = new ws("wss://gateway.discord.gg/?v=8&encoding=json")
    }

    heartbeat = (ms: number, ws: ws) => {
        setInterval(function () {
            ws.send(JSON.stringify({ "op": 1, "d": 251 }))
            ws.on("message", (message) => {
                const data = JSON.parse(message.toString())
                if (data["op"] != 11) {
                    return
                }
            })
        }, this.heartbeat_ms)
    }

    connect = () => {
        this.socket.on("open", () => {
            this.socket.send(JSON.stringify({
                "op": 2,
                "d": {
                    "token": this.token,
                    "intents": this.intents,
                    "properties": {
                        "$os": "windows",
                        "$browser": "disco",
                        "$device": "disco"
                    }
                }
            }))

            this.socket.on("message", (message) => {
                const data = JSON.parse(message.toString())
                if (data["t"] === null && !this.ready) {
                    this.heartbeat_ms = data['d']['heartbeat_interval']
                    this.heartbeat(this.heartbeat_ms, this.socket)
                    this.messages(this.socket)
                }

                if (data['t'] === "READY" && !this.ready) {
                    this.ready = true
                }

                if (data['t'] === "GUILD_CREATE" && this.ready) {
                    this.guilds.add(data.d)
                    //this.emit("ready", new User(data.d.user,this))
                }
            })

        })
    }

    messages = (ws: ws) => {
        ws.on("message", (message) => {
            const data = JSON.parse(message.toString())
            if (data["t"] === "MESSAGE_CREATE") {
                this.emit("message", new Message(data['d'], this))
            }
        })
    }

    createMessage = (channelID: number, content: string) => {
        axios.post(`https://discord.com/api/channels/${channelID}/messages`, {
            "content": content,
        },
            {
                headers: {
                    authorization: `Bot ${this.token}`
                }
            }).catch(err => {
                console.log(err.response)
            })
    }
}