const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

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
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: "Reaction",
    }]
}, {
    toJSON: {
        virtuals: true
    }
});

ThoughtSchema.virtual("reactionsCount").get(function(){
    return this.reactions.length
})

const ThoughtModel = model("Thought", ThoughtSchemaSchema)

module.exports = ThoughtModel;