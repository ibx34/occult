import { Base } from "./Base";
import { TextChannel } from "./TextChannel";
import { User } from "./User";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { MessageMentions } from "./MessageMentiosn";

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
                    //console.log(channel)
                    if (channel.id == data.channel_id){
                        this.channel = new TextChannel(channel,this._client)
                    }
                }
            }
        }
        if (data.member !== undefined){
            data.member['user'] = data.author
            this.member = new Member(data.member,this._client,this._guild)
        }
        if (data.mentions !== undefined){
            this.mentions = new MessageMentions(data.mentions,this._client,this._guild)
        } 
    }
}