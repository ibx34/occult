import { Base } from "./Base";
import axios from "axios";

export class Guild extends Base {
    [x: string]: any

    constructor(data, client) {
        super(data.id)

        this._client = client
        this.update(data)
    }

    update(data) {
        if (data.name !== undefined) {
            this.name = data.name
        }
        if (data.id !== undefined) {
            this.id = data.id
        }
    }

    kick = (userID: string, reason?: string) => {
        axios.delete(`https://discord.com/api/guilds/${this.id}/members/${userID}`, {
            headers: {
                authorization: `Bot ${this._client.token}`,
                "x-audit-log-reason": reason
            }
        }).catch(err => {
            console.log(err.response)
        })
    }

    ban = (userID: string, delete_message_days?:number,reason?:string) => {
        axios.put(`https://discord.com/api/guilds/${this.id}/bans/${userID}`, {
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

    addRole = (roleID: string, userID: string, reason?:string) => {
        axios.put(`https://discord.com/api/guilds/${this.id}/members/${userID}/roles/${roleID}`, null,
        {
            headers: {
                authorization: `Bot ${this._client.token}`,
                "x-audit-log-reason": reason
            }
        }).catch(err => {
            console.log(err.response)
        })                
    }
    removeRole = (roleID: string, userID: string, reason?:string) => {
        axios.delete(`https://discord.com/api/guilds/${this.id}/members/${userID}/roles/${roleID}`,
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