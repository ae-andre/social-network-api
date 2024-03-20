const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');
const reactionSchema = require('./Reaction')

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function(x){
            return dayjs(x).format('DD/MM/YYYY')
        },
    },
    username: [{
        type: String,
        ref: "User",
    }],
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true
    }
});

ThoughtSchema.virtual("reactionsCount").get(function(){
    return this.reactions.length
})

const ThoughtModel = model("Thought", ThoughtSchema)

module.exports = ThoughtModel;