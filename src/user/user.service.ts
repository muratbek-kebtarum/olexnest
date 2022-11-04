import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserEntity} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {sign} from "jsonwebtoken";
import {JWT_SECRET} from "../config";
import {UserResponseInterface} from "./types/userResponse.interface";
import {LoginUserDto} from "./dto/loginUser.dto";
import {compare} from "bcrypt";
import {UpdateUserDto} from "./dto/updateUser.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
    }

//-----------------------------------------------------------------------
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
            }

        });
        const userByUsername = await this.userRepository.findOne({
            where: {
                username: createUserDto.username,
            }
        });

        if (userByEmail || userByUsername) {
            throw new HttpException('Email or Username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto); //мы перезаписываем все поля либо добавляем новые из createUserDto в newUser
        return await this.userRepository.save(newUser); //сохр нового пользователя внути бд
    }
    //-----------------------------------------------------------------------
    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email,
            },
            select: ['id', 'email', 'bio', 'image', 'password']
        });

        if(!user){
            throw new HttpException(
                'Credentials are not valid',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }
        const isPasswordCorrect = await compare(loginUserDto.password, user.password)

        if (!isPasswordCorrect) {
            throw new HttpException('Credentials not valid',
                HttpStatus.UNPROCESSABLE_ENTITY);
        }
        delete user.password;
        return user;
    }
//-----------------------------------------------------------------------
    findById(id: number): Promise<UserEntity>{
        return this.userRepository.findOne({where:{id}});
    }
//-----------------------------------------------------------------------
    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity>{
        const user = await this.findById(userId);

        Object.assign(user, updateUserDto); //мы перезаписываем все поля либо добавляем новые из createUserDto в newUser
        console.log('user', user);
        console.log('currentUser', updateUserDto);

        return await this.userRepository.save(user); //сохр нового пользователя внути бд
    }
//-----------------------------------------------------------------------
    generateJwt(user: UserEntity): string {
        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET);
    }
//-----------------------------------------------------------------------
    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user),
            }
        }
    }
}
