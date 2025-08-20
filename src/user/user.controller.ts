import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "src/model/user.model";
import { UserService } from "./user.service";
import { WebResponse } from "src/model/web.model";
import { JwtAuthGuard } from "src/utils/jwt-auth.guard";


@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
        const registerBody = await this.userService.register(request);
        return { data: registerBody }
    }

    @Post('/login')
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
        const loginUser = await this.userService.login(request);
        return { data: loginUser }
    }

    @UseGuards(JwtAuthGuard)
    @Get('post')
    getPost(): string {
        return "auth user"
    }
}