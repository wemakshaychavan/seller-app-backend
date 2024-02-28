import mongoose from 'mongoose';
import { uuid } from 'uuidv4';


const offerSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => uuid(),
    },
    organization: {
        type: String,
        ref:'Organization',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    offerId: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    autoApply: {
        type: Boolean,
        default: false,
    },
    validity: { createdBy: { type: String },
    updatedBy: { type: String },
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        }
    },
    createdBy: { type: String },
    updatedBy: { type: String },
    createdAt: {
        type: Number,
        default: Date.now()
    },
    updatedAt: {
        type: Number,
        default: Date.now()
    },
}, {
    strict: true,
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;