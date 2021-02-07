import { Member } from "./Structures/Member";
import { GuildChannel } from "./Structures/GuildChannel";
//import { Role } from "./Structures/Roles";

export class Guilds {
    guilds = {};

    updateChannels = (channels) => {
        const newChannels = []

        for(const channel of channels){
            newChannels.push({
                id: channel.id,
                name: channel.name,
                parent_id: channel.parent_id,
                permission_overwrites: channel.permission_overwrites,
                type: channel.type,
                nsfw: channel.nsfw
            })
        }

        return newChannels
    }

    add = (data) => {
        let newData = new Object;
        newData["id"] = data.id;
        newData["name"] = data.name;
        newData["icon"] = data.icon;
        newData["member_count"] = data.member_count;
        newData["large"] = data.large;
        newData["channels"] = this.updateChannels(data.channels)
        newData["members"] = data.members;
        newData["roles"] = data.roles;
        newData["description"] = data.description;
        newData["premium_tier"] = data.premium_tier;
        
        console.log(newData['channels'])
        this.guilds[data['id']] = newData;
    }

    remove = (id) => {
        delete this.guilds[id]
    }

    get = (id) => {
        return this.guilds[id]
    }

    getAll = () => {
        return this.guilds
    }
}