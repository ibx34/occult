import { Member } from "./Member";

export class MessageMentions {
    [x: string]: any

    constructor(data,client,guild){
        this._client = client
        this.data = data
        this._guild = guild.id

        this.update(data)
    }

    update(data){
        if (data[0] !== undefined){
            let new_data = new Object();
            new_data = data[0].member
            new_data['user'] = data[0]

            this.first = new Member(new_data,this._client,this._guild)
        }
    }
}