import Offer from '../../../offers/models/offer.model';
import OfferBenifit from '../../../offers/models/offerBenifit.model';
import OfferQualifier from '../../../offers/models/offerQualifier.model';
import { ConflictError, DuplicateRecordFoundError, NoRecordFoundError } from '../../../../lib/errors';
import MESSAGES from '../../../../lib/utils/messages';

class OfferService {
    /**
 * internal func to store cutomizations
 * @param {*} offerDetails 
 * @param {*} currentUser 
 * @returns true
 */
    async createOffer(offerDetails, currentUser) {
        try {
            if (offerDetails) {
                const existingOffer = await Offer.findOne({
                    offerId: offerDetails.offerId,
                    organization: currentUser.organization
                });

                if (!existingOffer) {
                    let offerObj = {
                        type: offerDetails.type,
                        organization: currentUser.organization,
                        offerId: offerDetails.offerId,
                        description: offerDetails.description,
                        validity: offerDetails.validity,
                        autoApply: offerDetails.autoApply,
                        updatedBy: currentUser.id,
                        createdBy: currentUser.id,
                    };
                    let offer = new Offer(offerObj);
                    await offer.save();
                    return newOffer;
                } else {
                    throw new DuplicateRecordFoundError(MESSAGES.OFFER_CODE_EXISTS);
                }
            }
        } catch (err) {
            console.log(`[OfferService] [create] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

    async getOffers(params, currentUser) {
        try {
            let query = {
                organization:currentUser.organization
            };
            
            if (params.offerId) {
                query.offerId = { $regex: params.offerId, $options: 'i' }; // Case-insensitive name search
            }
    
            const existingOffers = await Offer.find(query).sort({ createdAt: 1 })
                .skip(params.offset)
                .limit(params.limit);
            const count = await Offer.count(query);
            return {count,data:existingOffers};
        } catch (err) {
            console.log(`[OfferService] [getOffers] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }    

    async updateOffer(id,offerDetails, currentUser) {
        //TODO:Tirth check if given name has already been use in other group and throw error(Done)
        try {
            let existingOffer = await Offer.findOne({
                _id: id,
                organization: currentUser.organization,
            }).lean();
            let existingOfferId = await Offer.findOne({
                _id:{$ne:existingOffer._id},
                offerId: offerDetails.offerId,
                organization: currentUser.organization,
            });
            if(existingOfferId){
                throw new DuplicateRecordFoundError(MESSAGES.OFFER_CODE_EXISTS);
            }
            if (existingOffer) {
                let offerObj = {
                    type: offerDetails.type,
                    offerId: offerDetails.offerId,
                    description: offerDetails.description,
                    validity: offerDetails.validity,
                    autoApply: offerDetails.autoApply,
                    updatedBy: currentUser.id,
                };
                const offer = {...existingOffer,...offerObj};
                await Offer.updateOne({ _id: existingOffer._id,organization: currentUser.organization},offer);
                return offer;
            } else {
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
        } catch (err) {
            console.log(`[OfferService] [update] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

    async deleteOffer(currentUser, offerId) {
        try {
            let offerExist = await Offer.findOne({
                _id: id,
                organization: currentUser.organization,
            });
            if(!offerExist){
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
            const deletedOffer = await Offer.deleteOne({ _id: offerId, organization: currentUser.organization });
            return { success: true, deletedOffer };
        } catch (err) {
            console.log(`[OfferService] [deleteCustomizations] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

    async getOfferById(offerId, currentUser) {
        try {
            const offer = await Offer.findOne({
                _id: offerId,
                organization: currentUser.organization
            });
    
            if (!offer) {
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
            return offer;
        } catch (err) {
            console.log(`[OfferService] [getOfferById] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

}

export default OfferService;
