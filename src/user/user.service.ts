import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { RegisterUserRequest, UserResponse } from "src/model/user.model";
import { UserValidation } from "./user.validation";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerUser: RegisterUserRequest =
            this.validationService.validate(UserValidation.REGISTER, request) as RegisterUserRequest

        const existUser = await this.prismaService.user.findUnique({
            where: { email: registerUser.email }
        })
        if (existUser) {
            throw new HttpException('EMAIL ALREADY TAKEN', HttpStatus.BAD_REQUEST)
        }
        registerUser.password = await bcrypt.hash(registerUser.password, 10)
        const newUser = await this.prismaService.user.create({ data: registerUser })
        return {
            email: newUser.email,
            username: newUser.username,
        };
    }




}