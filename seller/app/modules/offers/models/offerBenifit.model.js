import mongoose from 'mongoose';
import { uuid } from 'uuidv4';


const offerBenifitSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => uuid(),
    },
    organization: {type:String,ref:'Organization'},
    offer: {type:String,ref:'Offer'},
    minValue: {type:String},
    itemCount: {type:String},
    itemId: {type:[String]},
    itemValue: {type:String},
    valueType: {type:String},
    value: {type:String},
    valueCap: {type:String},
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


//offerBenifitSchema.index({ _id: 1 ,organization:1}, { unique: false });
const OfferBenifit = mongoose.model('OfferBenifit', offerBenifitSchema);
module.exports = OfferBenifit;
