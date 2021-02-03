import { Base } from "./Base";

export class User extends Base {
    [x: string]: any;

    constructor(data,client){
        super(data.id)

        this._client = client
        this.update(data)
    }

    update(data){
        if(data.username !== undefined){
            this.username = data.username
            if (data.discriminator !== undefined){
                this.fullname = `${data.username}#${data.discriminator}`
            }
        }
        if (data.discriminator !== undefined){
            this.discriminator = data.discriminator
        }
        if (data.bot !== undefined){
            this.bot = data.bot
        }
        if (data.avatar !== undefined){
            this.avatar = data.avatar
        }
    }

    get avatar_url(){
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.webp?size=1024`
    }
}