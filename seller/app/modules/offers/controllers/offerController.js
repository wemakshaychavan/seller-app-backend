import OfferService from '../v1/services/offerService';

const offerService = new OfferService();

class OfferController {
    async storeOffer(req, res, next) {
        try {
            const data = req.body;
            const offer = await offerService.createOffer(data, req.user);
            return res.send(offer);
        } catch (error) {
            next(error);
        }
    }

    async getOffers(req, res, next) {
        try {
            const currentUser = req.user;
            const offers = await offerService.getOffers(req.query,currentUser);
            return res.json(offers);
        } catch (error) {
            next(error);
        }
    }

    async updateOffer(req, res, next) {
        try {
            const currentUser = req.user;
            const data = req.body;
            const {offerId} = req.params;
            const updateResult = await offerService.updateOffer(offerId,data, currentUser);
            return res.send(updateResult);
        } catch (error) {
            next(error);
        }
    }

    async deleteOffer(req, res, next) {
        try {
            const currentUser = req.user;
            const {offerId} = req.params;
            const deleteResult = await offerService.deleteOffer(currentUser, offerId);
            return res.send(deleteResult);
        } catch(error) {
            next(error);
        }
    }

    async getOfferById(req, res, next) {
        const { offerId } = req.params;
        try{
            const currentUser = req.user;
            const offer = await offerService.getOfferById(offerId, currentUser);
            return res.send(offer);
        } catch(error) {
            next(error);
        }
    }
}

export default OfferController;
