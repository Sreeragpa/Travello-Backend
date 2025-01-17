import  express  from "express";
import { CloudinaryService } from "../utils/cloudinaryService";
import { TripRepository } from "../../repository/trip.repository";
import { TripUsecase } from "../../usecase/trip.usecase";
import { TripController } from "../../controllers/trip.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FollowRepository } from "../../repository/follow.repository";
import { NotificationRepository } from "../../repository/notification.repository";
import { NotificationUsecase } from "../../usecase/notification.usecase";
import { ConversationRepository } from "../../repository/conversation.repository";
import { UserRepository } from "../../repository/user.repository";

const router = express.Router();
const clodinaryService = new CloudinaryService();
const tripRepository = new TripRepository();
const followRepository = new FollowRepository()
const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository()
const notificationUsecase = new NotificationUsecase(notificationRepository,userRepository)
const conversationRepository = new ConversationRepository()

const tripUsecase = new TripUsecase(tripRepository,clodinaryService,followRepository,notificationUsecase,conversationRepository);
const tripController = new TripController(tripUsecase)

router.post('/add-trip', authMiddleware,(req, res, next) => tripController.createTrip(req, res, next));
router.get('/get-trip', authMiddleware,(req, res, next) => tripController.getTrips(req, res, next));
router.get('/get-trip/:id', authMiddleware,(req, res, next) => tripController.getTrips(req, res, next));
router.post('/join-trip', authMiddleware,(req, res, next) => tripController.joinTrip(req, res, next));
router.post('/accept-request', authMiddleware,(req, res, next) => tripController.acceptJoinRequest(req, res, next));
router.get('/count', authMiddleware,(req, res, next) => tripController.getTripCount(req, res, next));
router.get('/count/:profileid', authMiddleware,(req, res, next) => tripController.getTripCount(req, res, next));
router.get('/user-trips', authMiddleware,(req, res, next) => tripController.getUserTrips(req, res, next));
router.get('/user-trips/:profileid', authMiddleware,(req, res, next) => tripController.getUserTrips(req, res, next));
router.put('/edit-trip/:id', authMiddleware,(req, res, next) => tripController.updateTrip(req, res, next));
router.get('/search-trip', authMiddleware,(req, res, next) => tripController.searchTrip(req, res, next));


export default router