import Offer from '../../../offers/models/offer.model';
import OfferBenefit from '../../../offers/models/offerBenefit.model';
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
                if (existingOffer) {
                    throw new DuplicateRecordFoundError(MESSAGES.OFFER_CODE_EXISTS);
                }

                const offerQualifierData = offerDetails.qualifiers
                const offerBenefitData = offerDetails.benefits
                let offerObj = {
                    type: offerDetails.type,
                    organization: currentUser.organization,
                    offerId: offerDetails.offerId,
                    description: offerDetails.description,
                    valid: {
                        from: offerDetails.validFrom,
                        to: offerDetails.validTo,
                    },
                    autoApply: offerDetails.autoApply,
                    additive: offerDetails.additive,
                    images: offerDetails.images,
                    items: offerDetails.items,
                    updatedBy: currentUser.id,
                    createdBy: currentUser.id,
                };
                let offer = new Offer(offerObj);
                await offer.save();
                let offerQualifierObj = { ...offerQualifierData };
                offerQualifierObj.offer = offer.id;
                offerQualifierObj.organization = currentUser.organization;
                const offerQualifier = new OfferQualifier(offerQualifierObj)
                await offerQualifier.save();
                let offerBenefitObj = { ...offerBenefitData };
                offerBenefitObj.offer = offer.id;
                offerBenefitObj.organization = currentUser.organization;
                const offerBenefit = new OfferBenefit(offerBenefitObj)
                await offerBenefit.save();
                return offer;
            }
        } catch (err) {
            console.log(`[OfferService] [create] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

    async getOffers(params, currentUser) {
        try {
            let query = {
                organization: currentUser.organization
            };

            if (params.offerId) {
                query.offerId = { $regex: params.offerId, $options: 'i' }; 
            }

            const existingOffers = await Offer.find(query).sort({ createdAt: 1 })
                .skip(params.offset)
                .limit(params.limit);
            const count = await Offer.count(query);
            return { count, data: existingOffers };
        } catch (err) {
            console.log(`[OfferService] [getOffers] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

    async updateOffer(id, offerDetails, currentUser) {
        try {
            let existingOffer = await Offer.findOne({
                _id: id,
                organization: currentUser.organization,
            }).lean();
            if (!existingOffer) {
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
            let existingOfferId = await Offer.findOne({
                _id: { $ne: existingOffer._id },
                offerId: offerDetails.offerId,
                organization: currentUser.organization,
            });
            if (existingOfferId) {
                throw new DuplicateRecordFoundError(MESSAGES.OFFER_CODE_EXISTS);
            }
            console.log({hello : offerDetails})

            const offerQualifierData = offerDetails.qualifiers
            const offerBenefitData = offerDetails.benefits
           
            let offerObj = {
                type: offerDetails.type,
                organization: currentUser.organization,
                offerId: offerDetails.offerId,
                description: offerDetails.description,
                valid: {
                    from: offerDetails.validFrom,
                    to: offerDetails.validTo,
                },
                autoApply: offerDetails.autoApply,
                additive: offerDetails.additive,
                images: offerDetails.images,
                items: offerDetails.items,
                updatedBy: currentUser.id,
                createdBy: currentUser.id,
            };
            const offer = { ...existingOffer, ...offerObj };
            await Offer.updateOne({ _id: existingOffer._id, organization: currentUser.organization }, offer);

            const offerQualifier = await OfferQualifier.findOne({ offer: existingOffer._id, organization: currentUser.organization }).lean()
            const offerQualifierObj = { ...offerQualifier, ...offerQualifierData };
            console.log({offerQualifierObj})
            await OfferQualifier.updateOne({ _id: offerQualifier._id, organization: currentUser.organization }, offerQualifierObj);


            const offerBenefit = await OfferBenefit.findOne({ offer: existingOffer._id, organization: currentUser.organization }).lean();
            const offerBenefitObj = { ...offerBenefit, ...offerBenefitData };
            console.log({offerBenefitObj})

            await OfferBenefit.updateOne({ _id: offerBenefit._id, organization: currentUser.organization }, offerBenefitObj);
            return offer;
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
            if (!offerExist) {
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
            const deletedOffer = await Offer.deleteOne({ _id: offerId, organization: currentUser.organization });
            await OfferBenefit.deleteOne({ _id: offerId, organization: currentUser.organization });
            await OfferQualifier.deleteOne({ _id: offerId, organization: currentUser.organization });
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
            }).lean();

            if (!offer) {
                throw new NoRecordFoundError(MESSAGES.OFFER_NOT_EXISTS);
            }
            const offerBenefit = await OfferBenefit.findOne({ offer: offerId, organization: currentUser.organization });
            const offerQualifier = await OfferQualifier.findOne({ offer: offerId, organization: currentUser.organization });
            offer.benefits = offerBenefit;
            offer.qualifiers = offerQualifier;
            return offer;
        } catch (err) {
            console.log(`[OfferService] [getOfferById] Error - ${currentUser.organization}`, err);
            throw err;
        }
    }

}

export default OfferService;
