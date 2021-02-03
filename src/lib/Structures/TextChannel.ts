import { CategoryChannel } from "./CategoryChannel";
import { GuildChannel } from "./GuildChannel";

export class TextChannel extends GuildChannel {
    [x: string]: any

    constructor(data, client) {
        super(data,client)

        this._client = client;
        this.update(data)
    }

    update(data) {
        if (data.name != undefined) {
            this.name = data.name
        }
        if (data.id !== undefined) {
            this.id = data.id
        }
        if (data.topic !== undefined) {
            this.topic = data.topic
        }
        if (data.nsfw !== undefined) {
            this.nsfw = data.nsfw ? true : false
            this.is_nsfw = data.nsfw ? true : false
        }
    }

    send = (content: string) => {
        this._client.createMessage(this.id, content)
    }

    createMessage = (content: string) => {
        this.send(content)
    }
}