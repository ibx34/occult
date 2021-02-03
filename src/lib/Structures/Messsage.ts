import { Base } from "./Base";
import { TextChannel } from "./TextChannel";
import { User } from "./User";
import { Guild } from "./Guild";
import { Member } from "./Member";

export class Message extends Base{
    [x: string]: any

    constructor(data,client){
        super(data.id)
        this._client = client;
        this._guild =this._client.guilds.get(data.guild_id.toString())
        this.update(data)
    }

    update(data){
        if (data.content !== undefined){
            this.content = data.content || "";
        };
        if (data.author !== undefined){
            this.author = new User(data.author,this._client)
        }
        if (data.guild_id !== undefined){
            this.guild = new Guild(this._client.guilds.get(data.guild_id.toString()),this._client)
        }
        if (data.guild_id !== undefined){
            if (data.channel_id !== undefined){
                for (const channel of this._guild.channels){
                    if (channel.id == data.channel_id){
                        this.channel = new TextChannel(channel,this._client)
                    }
                }
            }
        }
        if (data.member !== undefined && data.guild_id !== undefined){
            this.member = new Member(data.author,this._client,this._guild)
        } 
    }
}