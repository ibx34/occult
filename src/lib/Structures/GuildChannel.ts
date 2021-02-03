import { Channel } from "./Channel";
import { CategoryChannel } from "./CategoryChannel";

export class GuildChannel extends Channel {
    [x: string]: any

    constructor(data, client) {
        super(data, client)

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
        if (data.parent_id !== undefined){
            this.parent_id = data.parent_id
        }
    }
}