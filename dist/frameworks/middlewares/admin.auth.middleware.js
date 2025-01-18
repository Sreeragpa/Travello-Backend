"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const adminAuthMiddleware = (req, res, next) => {
    try {
        const authToken = req.cookies.authTokenAdmin;
        if (!authToken) {
            return res.sendStatus(401);
        }
        // const token = authHeader.split(' ')[1];
        const adminData = (0, jwt_utils_1.verifyJWT)(authToken);
        if (!adminData || !(adminData === null || adminData === void 0 ? void 0 : adminData.isAdmin)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.admin = adminData; // Attach user data to the request object
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'JWT Verification Error' });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
