import {UserEntity} from "../user.entity";

export type UserType = Omit<UserEntity, 'hashPassword'>; //2-параметра, 1-й то с чем мы имее, второе то что мы хотим убрать из него,
// т.е. это в итоге это все поля userEntity только без пароля
