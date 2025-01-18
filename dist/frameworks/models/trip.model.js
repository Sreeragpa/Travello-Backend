"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tripSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    creator_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    startingPoint: {
        name: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    destination: {
        name: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    members: {
        type: [mongoose_1.default.Types.ObjectId],
        required: true
    },
    memberlimit: {
        type: Number
    },
    conversation_id: {
        type: mongoose_1.default.Types.ObjectId
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: String
}, { timestamps: true });
// Indexes
tripSchema.index({ "startingPoint.coordinates": "2dsphere" });
tripSchema.index({ "destination.coordinates": "2dsphere" });
tripSchema.index({ title: "text" });
tripSchema.index({ description: "text" });
tripSchema.index({ "startingPoint.name": "text" });
tripSchema.index({ "destination.name": "text" });
exports.TripModel = mongoose_1.default.model("trips", tripSchema);
