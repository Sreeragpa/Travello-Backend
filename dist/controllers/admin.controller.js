"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_model_1 = require("../frameworks/models/admin.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminController {
    constructor(adminUsecase) {
        this.adminUsecase = adminUsecase;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log(req.body);
                if (!email || !password) {
                    return res.status(401).json({ message: 'Email and Password Required' });
                }
                const admin = yield this.adminUsecase.adminLogin(email, password);
                const token = admin.token;
                res.cookie('authTokenAdmin', token, {
                    httpOnly: true,
                    secure: true, // Use true if you're serving over HTTPS
                    sameSite: 'none' // Allows cross-site cookie usage
                });
                res.status(200).json({ status: "success", data: admin });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    res.status(200).json({ status: 'authenticated' });
                }
                catch (error) {
                    next(error);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(401).json({ message: 'Email and Password Required' });
            }
            const hashedpassword = yield bcrypt_1.default.hash(password, 10);
            const admin = new admin_model_1.adminModel({
                email: email,
                password: hashedpassword
            });
            const savedAdmin = yield admin.save();
            res.status(200).send({ status: "success", data: savedAdmin });
        });
    }
    getPostStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const period = Number(req.query.period);
            if (!period && period !== 0) {
                return res.status(401).json({ message: 'Period Required' });
            }
            const data = yield this.adminUsecase.postsCountByDate(period);
            res.status(200).json({ status: 'success', data: data });
        });
    }
    getTripStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const period = Number(req.query.period);
            if (!period && period !== 0) {
                return res.status(401).json({ message: 'Period Required' });
            }
            const data = yield this.adminUsecase.tripsCountByDate(period);
            res.status(200).json({ status: 'success', data: data });
        });
    }
    getUserStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const period = Number(req.query.period);
            if (!period && period !== 0) {
                return res.status(401).json({ message: 'Period Required' });
            }
            const data = yield this.adminUsecase.usersCountByDate(period);
            res.status(200).json({ status: 'success', data: data });
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.adminUsecase.getAllUsers();
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = String(req.query.search);
                if (query && !query.trim()) {
                    return res.status(401).json({ message: 'Invalid Search' });
                }
                query = query.trim();
                const data = yield this.adminUsecase.searchUsers(query);
                res.status(200).json({ status: 'success', data: data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userid = req.params.id;
                console.log(userid);
                if (!userid) {
                    return res.status(400).json({ message: 'Invalid Userid' });
                }
                const user = yield this.adminUsecase.blockUser(userid);
                res.status(200).json({ status: 'success', data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unBlockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userid = req.params.id;
                if (!userid) {
                    return res.status(400).json({ message: 'Invalid Userid' });
                }
                const user = yield this.adminUsecase.unBlockUser(userid);
                res.status(200).json({ status: 'success', data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.cookie('authTokenAdmin', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                expires: new Date(0), // Set expiration date to the past
            });
            res.status(200).json({ status: "success", data: "Logged out successfully" });
        });
    }
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ status: "success", data: true });
        });
    }
}
exports.default = AdminController;
