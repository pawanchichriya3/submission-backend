import { NextFunction, Request, Response } from "express";

export const appErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log(err);

    const statusCode = (typeof err?.statusCode === 'number') ? err.statusCode : 400;
    const message = err?.message || "Bad Request";

    res.status(statusCode).json({
        success: false,
        message,
    });
}

export const genericErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}