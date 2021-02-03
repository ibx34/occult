import { Base } from "./Base";
import { TextChannel } from "./TextChannel";

export class CategoryChannel extends Base{
    [x: string]: any

    constructor(data,client){
        super(data.id)
        this._client = client;
        this.update(data)
    }

    update(data){
        if (data.id !== undefined){
            this.id = data.id
        }
        if (data.name !== undefined){
            this.name = data.name
        }
        if (data.type !== undefined){
            this.type = data.type
        }
        if (data.position !== undefined){
            this.position = data.position
        }
    }
}