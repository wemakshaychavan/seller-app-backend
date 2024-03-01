import Joi from 'joi';
module.exports = {
    create: () => {
        return Joi.object({
            type: Joi.string(),
            offerId: Joi.string(),
            description: Joi.string().allow(''),
            autoApply: Joi.boolean(),
            additive: Joi.boolean(),
            validFrom: Joi.number(),
            validTo: Joi.number(),
            items: Joi.array(),
            images: Joi.array(),
            qualifiers: Joi.object({
                minValue: Joi.number(),
                itemCount: Joi.number(),
            }),
            benefits: Joi.object({
                valueType: Joi.string(),
                value: Joi.number(),
                valueCap: Joi.number(),
                itemCount: Joi.number(),
                itemId: Joi.string(),
                itemValue: Joi.number(),
            })
        });
    },
    update: () => {
        return Joi.object({
            type: Joi.string(),
            offerId: Joi.string(),
            description: Joi.string().allow(''),
            autoApply: Joi.boolean(),
            additive: Joi.boolean(),
            validFrom: Joi.number(),
            validTo: Joi.number(),
            items: Joi.array(),
            images: Joi.array(),
            qualifier: Joi.object({
                minValue: Joi.number(),
                itemCount: Joi.number(),
            }),
            benefit: Joi.object({
                valueType: Joi.string(),
                value: Joi.number(),
                valueCap: Joi.number(),
                itemCount: Joi.number(),
                item: Joi.object(),
                itemValue: Joi.number(),
            })
        });
    }
};
