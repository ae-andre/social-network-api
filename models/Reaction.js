const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function(x){
        return dayjs(x).format('DD/MM/YYYY')
    },
    }
  }, {
    toObject: { getters: true },
    toJSON: { getters: true }
  });

  module.exports = reactionSchema;