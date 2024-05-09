import mongoose from 'mongoose';
import { uuid } from 'uuidv4';


const offerBenefitSchema = new mongoose.Schema({
    _id: {
        type: String,   
        required: true,
        default: () => uuid(),
    },
    organization: { type: String, ref: 'Organization' },
    offer: { type: String, ref: 'Offer' },
    valueType: { type: String },
    value: { type: Number },
    valueCap: { type: Number },
    itemCount: { type: Number },
    item: { type: Object },
    itemValue: { type: Number },
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


//offerBenefitSchema.index({ _id: 1 ,organization:1}, { unique: false });
const OfferBenefit = mongoose.model('OfferBenefit', offerBenefitSchema);
export default OfferBenefit;
