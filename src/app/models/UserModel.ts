export interface UserModel {
    username: string;
    name: string;
    email: string;
    birth: Date;
    phone: string;
    address: string;

    loggedIn: boolean;
}