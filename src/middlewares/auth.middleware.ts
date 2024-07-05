import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("this is auth middleware", req.method, req.url);
        next();
    }
}
