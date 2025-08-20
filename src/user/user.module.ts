import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstant } from "../utils/constants";
import { JwtStrategy } from "src/utils/jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstant.secret,
            signOptions: { expiresIn: '60s' }
        })],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
})

export class UserModule { }