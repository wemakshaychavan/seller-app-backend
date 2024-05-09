import OfferController from '../controllers/offerController';
import apiParamsValidator from '../v1/middleware/api.params.validator';
import offerSchema from '../v1/validationSchema/offer.validate.schema'
import express from 'express';
import { authentication, authorisation } from '../../../lib/middlewares';
const router = express.Router();

const offerController = new OfferController();

router.post('/v1/offers',
    authentication.middleware(),
    // apiParamsValidator.middleware({ schema: offerSchema.create() }), 
    offerController.storeOffer);

router.get('/v1/offers/:offerId',
    authentication.middleware(),
    offerController.getOfferById);

router.delete('/v1/offers/:offerId',
    authentication.middleware(),
    offerController.deleteOffer);

router.get('/v1/offers',
    authentication.middleware(),
    offerController.getOffers);

router.put('/v1/offers/:offerId',
    authentication.middleware(),
    // apiParamsValidator.middleware({ schema: offerSchema.update() }), 
    offerController.updateOffer);

module.exports = router;
