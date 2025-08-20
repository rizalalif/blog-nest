import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterUserRequest, UserResponse } from "src/model/user.model";
import { UserService } from "./user.service";
import { WebResponse } from "src/model/web.model";


@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
        const registerBody = await this.userService.register(request);
        return { data: registerBody }
    }
}