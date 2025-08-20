import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserResponse,
} from 'src/model/user.model';
import { UserValidation } from './user.validation';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
        private jwtService: JwtService
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerUser: RegisterUserRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request,
        ) as RegisterUserRequest;

        const existUser = await this.prismaService.user.findUnique({
            where: { email: registerUser.email },
        });
        if (existUser) {
            throw new HttpException('EMAIL ALREADY TAKEN', HttpStatus.BAD_REQUEST);
        }
        registerUser.password = await bcrypt.hash(registerUser.password, 10);
        const newUser = await this.prismaService.user.create({
            data: registerUser,
        });
        return {
            email: newUser.email,
            username: newUser.username,
        };
    }

    async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginUser: LoginUserRequest = (await this.validationService.validate(
            UserValidation.LOGIN,
            request,
        )) as LoginUserRequest;
        const user = await this.prismaService.user.findUnique({
            where: { email: loginUser.email },
        });

        if (!user) {
            throw new NotFoundException("Login failed: User not found! ")
        }

        const isValidUser = await bcrypt.compare(loginUser.password, user.password)
        if (!isValidUser) {
            throw new UnauthorizedException('Passowrd not match')
        }

        const token = await this.jwtService.signAsync({ userId: user.id, email: user.email })


        return { email: user.email, username: user.username, token: token };
    }
}
