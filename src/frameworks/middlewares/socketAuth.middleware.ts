import { Socket } from "socket.io";
import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function socketAuthMiddleware(socket: Socket, next: NextFunction) {
  const token = socket.handshake.auth.token;
  console.log(token,"From socket io");
  console.log(socket.handshake,"From socket handshake");
  
  // if (!token) {
  //   const error = new Error("Authentication error");
  //   return next(error);
  // }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    socket.data.user = decoded as JwtPayload; // Attach the decoded user data to the socket object
    next();
  } catch (err) {
    const error = new Error("Authentication error");
    return next(error);
  }
}
