import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';

export interface CurrentUser{
    id: number;
    email: string;
    role: string[];
}
export const CurrentUser = createParamDecorator((data: keyof CurrentUser | undefined, ctx: ExecutionContext) : CurrentUser | any => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as CurrentUser;

    if(!user)
    {
        throw new UnauthorizedException('User not authenticated')
    }

    if(data)
    {
        if(!user.hasOwnProperty(data))
            throw new Error(`Property ${data} does not in the object`)
        return user[data]
    }
    return user;

  return ;
});