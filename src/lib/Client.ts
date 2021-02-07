import ws from "ws"
import axios from "axios"
import eventEmitter from "eventemitter3";
import { Guilds } from "./Guilds";
import { Message } from "./Structures/Messsage";
import { User } from "./Structures/User";
import sizeOf from "object-sizeof";

interface botOptions {
    prefix: string
    intents: string
    ignoreBots?: boolean
}
interface statusType {
    name: string,
    activity: string,
    url?: string,
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
    isReady;
    activity = new Object()
    presence = new Object()

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

    setStatus = (status: string = "online" || "dnd" || "idle" || "invisible" || "offline", activity?: statusType, afk: boolean=false) => {
        const activities = { "playing": 0, "streaming": 1, "listening": 2, "competing": 5 }

        if (activity) {
            if (!activity.activity) {
                throw new Error("You must include an activity type.")
            }
            if (!["playing", "listening", "streaming", "competing"].includes(activity.activity.toLowerCase())) {
                throw new Error(`The status is not either "playing","listening","streaming" or "competing".`);
            }
            if (activity.activity.toLowerCase() == "streaming") {
                if (!activity.url) {
                    throw new Error("You must include a twitch url or any streaming platform if your activity is set to \"streaming\".")
                }
            }
            if (!activity.name) {
                throw new Error("You must provide an activity name.")
            }
            this.activity = {
                "name": activity.name,
                "type": activities[activity.activity],
                "url": activity.url || null
            }
        }

        this.presence={
            activities: [this.activity],
            status: status,
            afk: afk
        }
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
                    },
                    "presence": this.presence
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

                    const ready = () => {
                        this.emit("ready", new User(data.d.user, this))
                    }

                    this.isReady = new Promise(ready)
                }

                if (data['t'] === "GUILD_CREATE" && this.ready) {
                    
                    this.guilds.add(data.d)
                    //console.log(this.guilds.get(data.d.id).channels)
                    console.log(sizeOf(this.guilds.get(data.d.id)))
                    Promise.resolve(this.isReady)

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

    createMessage = (channelID: string, content: string) => {
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

    fetchUser = async (userID: string) => {
        const user = await axios.get(`https://discord.com/api/users/${userID}`,
            {

                headers: {
                    authorization: `Bot ${this.token}`
                }
            }).catch(err => {
                console.log(err.response)
            })

        return new User(user['data'], this)
    }
}