import { UserModel } from "models/user.model";


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
        
        console.log(
            email,
            password,
            salt,
            phone,
            userType
        );
    }
}