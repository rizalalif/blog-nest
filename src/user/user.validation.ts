import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1),
        email: z.email(),
        password: z.string().min(8)
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.email(),
        password: z.string().min(8)
    }).required()


}