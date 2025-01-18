"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_repository_1 = require("../../repository/admin.repository");
const admin_usecase_1 = require("../../usecase/admin.usecase");
const admin_controller_1 = __importDefault(require("../../controllers/admin.controller"));
const admin_auth_middleware_1 = require("../middlewares/admin.auth.middleware");
const post_repository_1 = require("../../repository/post.repository");
const trip_repository_1 = require("../../repository/trip.repository");
const user_repository_1 = require("../../repository/user.repository");
const router = express_1.default.Router();
const adminRespository = new admin_repository_1.AdminRepository();
const postRepository = new post_repository_1.PostRepository();
const tripRepository = new trip_repository_1.TripRepository();
const userRepository = new user_repository_1.UserRepository();
const adminUsecase = new admin_usecase_1.AdminUsecase(adminRespository, postRepository, tripRepository, userRepository);
const adminController = new admin_controller_1.default(adminUsecase);
router.post('/login', (req, res, next) => {
    adminController.login(req, res, next);
});
// router.post('/create',(req: Request,res: Response, next: NextFunction)=>{
//     adminController.create(req,res,next)
// })
router.get('/check-auth', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.checkAuth(req, res, next);
});
router.get('/posts/statistics', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.getPostStatistics(req, res, next);
});
router.get('/trips/statistics', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.getTripStatistics(req, res, next);
});
router.get('/users/statistics', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.getUserStatistics(req, res, next);
});
router.get('/get-users', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.getAllUsers(req, res, next);
});
router.get('/search-users', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.searchUsers(req, res, next);
});
router.post('/block/user/:id', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.blockUser(req, res, next);
});
router.post('/unblock/user/:id', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.unBlockUser(req, res, next);
});
router.post('/logout', (req, res, next) => {
    adminController.logout(req, res, next);
});
router.get('/isAdmin', admin_auth_middleware_1.adminAuthMiddleware, (req, res, next) => {
    adminController.isAdmin(req, res, next);
});
exports.default = router;
