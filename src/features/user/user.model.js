
export default class UserModel {

    constructor(name, email, password, type, id) {
        // "_id" is mongodb generated attribute name.
        this._id = id
        this.name = name
        this.email = email
        this.password = password
        this.type = type
    }

    static getAll() {
        return users;
    }
}