import  express  from "express";
import { CloudinaryService } from "../utils/cloudinaryService";
import { TripRepository } from "../../repository/trip.repository";
import { TripUsecase } from "../../usecase/trip.usecase";
import { TripController } from "../../controllers/trip.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FollowRepository } from "../../repository/follow.repository";

const router = express.Router();
const clodinaryService = new CloudinaryService();
const tripRepository = new TripRepository();
const followRepository = new FollowRepository()
const tripUsecase = new TripUsecase(tripRepository,clodinaryService,followRepository);
const tripController = new TripController(tripUsecase)

router.post('/add-trip', authMiddleware,(req, res, next) => tripController.createTrip(req, res, next));
router.get('/get-trip', authMiddleware,(req, res, next) => tripController.getTrips(req, res, next));

export default router