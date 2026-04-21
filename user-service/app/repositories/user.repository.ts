import { UserModel } from "models/dto/user.model";

export class UserRepository {
    constructor() {
        
    }

    async CreateAccount({
        email,
        password,
        salt,
        phone,
        userType
    } : UserModel) {
        
    }
}