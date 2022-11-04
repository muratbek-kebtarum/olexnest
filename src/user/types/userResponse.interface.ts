import {UserType} from "./user.type";

export interface UserResponseInterface{
    user: UserType & {token: string }; // здесь мы заменили userEntity на UserType,
    //потому что в usertype у нас все поля кроме пароля
}
