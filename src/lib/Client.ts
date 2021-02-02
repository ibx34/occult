import ws from "ws"
import axios from "axios"
import eventEmitter from "eventemitter3";
import { Guilds } from "./Guilds";

export class Client extends eventEmitter {
    token: string
    heartbeat_ms: number;
    intents: string;
    socket: ws;
    ready = false
    guilds = new Guilds()

    constructor(token: string, intents: string = "512") {
        super()

        this.token = token
        this.intents = intents
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
                }
    
                if (data['t'] === "READY" && !this.ready) {
                    this.ready = true
                }
    
                if (data['t'] === "GUILD_CREATE" && this.ready) {
                    this.guilds.add(data.d)
                    this.emit("ready", data.d)
                }
            })  
                  
        })
    }
}