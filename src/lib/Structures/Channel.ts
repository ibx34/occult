import { Base } from "./Base";
import { CategoryChannel } from "./CategoryChannel";

export class Channel extends Base{
    constructor(data, client){
        super(data.id)
        this._client = client

        if (data.type === 4){
            return new CategoryChannel(data,client)
        }
    }
}