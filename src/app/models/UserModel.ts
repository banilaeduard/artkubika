export interface UserModel {
    username: string;
    name: string;
    email: string;
    birth: Date;
    phone: string;
    address: string;

    isAdmin: boolean;
    token: string;
    expire: Date;
}