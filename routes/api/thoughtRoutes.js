const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought'); 
const User = require('../../models/User'); 

// GET all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single thought
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
  }
  res.json(thought);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
    const { thoughtText, username, userId } = req.body;
    try {
        const newThought = new Thought({ thoughtText, username });
        const savedThought = await newThought.save();

        // Push the created thought's _id to the associated user's thoughts
        await User.findByIdAndUpdate(userId, { $push: { thoughts: savedThought._id } });

        res.status(201).json(savedThought);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST to create a reaction stored in a thought's reactions array
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  const { reactionBody, username } = req.body;
  try {
      const updatedThought = await Thought.findByIdAndUpdate(
          req.params.thoughtId,
          { $push: { reactions: { reactionBody, username } } },
          { new: true, runValidators: true }
      );
      if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(updatedThought);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// PUT to update a thought
router.put('/thoughts/:id', async (req, res) => {
    const { thoughtText } = req.body;
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, { thoughtText }, { new: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE to remove a thought
router.delete('/thoughts/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        await User.findByIdAndUpdate(thought.username, { $pull: { thoughts: thought._id } });

        res.json({ message: 'Thought deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE to pull and remove a reaction
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
      const updatedThought = await Thought.findByIdAndUpdate(
          req.params.thoughtId,
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { new: true }
      );
      if (!updatedThought) {
          return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(updatedThought);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

module.exports = router;