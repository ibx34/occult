import { Base } from "./Base";
import axios from "axios";

export class Member extends Base{
    [x: string]: any

    constructor(data,client,guild){
        super(data.user.id || data.id);

        this._client = client
        this._guild = guild
        this.user = data.user
        this.update(data)
    }

    update(data){
        if (data.nick !== undefined || null) {
            this.nick = data.nick
            this.nickanme = this.nick
        }
        if (data.roles !== undefined) {
            this.roles = data.roles
        }
        if (data.joined_at !== undefined) {
            this.joined_at = data.joined_at
        }
        if (data.premium_since !== undefined) {
            this.premium_since = data.premium_since
            this.boosting_since = this.premium_since
            this.booster_since = this.premium_since
        }
        if (data.deaf !== undefined) {
            this.deaf = data.deaf
            this.is_muted = this.deaf
        }
        if (data.mute !== undefined) {
            this.mute = data.mute
            this.mute = this.mute
        }
        if (data.pending !== undefined) {
            this.pending = data.pending
        }
        if (data.permissions !== undefined) {
            this.permissions = data.permissions
        }
    }

    get avatar_url() {
        return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.webp?size=1024`
    }
    get mention() {
        return `<@${this.user.id}>`
    }
    get fullname() {
        return `${this.user.username}#${this.user.discriminator}`
    }
    get defaultAvatar() {
        return this.user.discriminator % 5;
    }
    get is_bot() {
        return this.user.bot
    }
    get avatar() {
        return this.user.avatar
    }
    get username() {
        return this.user.username
    }
    get discriminator() {
        return this.user.discriminator
    }

    kick = (reason?: string) => {
        axios.delete(`https://discord.com/api/guilds/${this._guild.id}/members/${this.id}`, {
            headers: {
                authorization: `Bot ${this._client.token}`,
                "x-audit-log-reason": reason
            }
        }).catch(err => {
            console.log(err.response)
        })
    }

    ban = (delete_message_days?:number,reason?:string) => {
        axios.put(`https://discord.com/api/guilds/${this._guild.id}/bans/${this.id}`, {
            reason: reason,
            delete_message_days: delete_message_days
        },
        {
            headers: {
                authorization: `Bot ${this._client.token}`
            }
        }).catch(err => {
            console.log(err.response)
        })        
    }

    addRole = (roleID: string, reason?:string) => {
        axios.put(`https://discord.com/api/guilds/${this._guild.id}/members/${this.id}/roles/${roleID}`, null,
        {
            headers: {
                authorization: `Bot ${this._client.token}`,
                "x-audit-log-reason": reason
            }
        }).catch(err => {
            console.log(err.response)
        })                
    }
    removeRole = (roleID: string, reason?:string) => {
        axios.delete(`https://discord.com/api/guilds/${this._guild.id}/members/${this.id}/roles/${roleID}`,
        {
            headers: {
                authorization: `Bot ${this._client.token}`,
                "x-audit-log-reason": reason
            }
        }).catch(err => {
            console.log(err.response)
        })                
    }
}