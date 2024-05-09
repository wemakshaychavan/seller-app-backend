import mongoose from 'mongoose';
import { uuid } from 'uuidv4';


const offerQualifierSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => uuid(),
    },
    organization: { type: String, ref: 'Organization' },
    offer: { type: String, ref: 'Offer' },
    minValue: { type: Number },
    itemCount: { type: Number },
    createdAt: {
        type: Number,
        default: Date.now()
    },
    updatedAt: {
        type: Number,
        default: Date.now()
    }
}, {
    strict: true,
    timestamps: true
});


//offerQualifierSchema.index({ _id: 1 ,organization:1}, { unique: false });
const OfferQualifier = mongoose.model('OfferQualifier', offerQualifierSchema);
export default OfferQualifier;
