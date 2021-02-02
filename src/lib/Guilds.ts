export class Guilds {
    guilds = {};

    add = (data) => {
        this.guilds[data['id']] = data
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