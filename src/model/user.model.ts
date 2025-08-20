

export class RegisterUserRequest {
    username: string
    email: string
    password: string
}

export class LoginUserRequest {
    email: string
    password: string
}
// export class AuthEntity
export class UserResponse {
    username: string
    email: string
    token?: string
}

