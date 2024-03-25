const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoriesSchema = new Schema({
    label: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
});

const virtual = categoriesSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
categoriesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

exports.Categories = mongoose.model('Categories', categoriesSchema);