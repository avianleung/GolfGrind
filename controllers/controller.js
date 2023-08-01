const db = require("../models");
const Entries = db.entries;

require("dotenv").config();

exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Entries.find({});
    res.send(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).send('An error occurred while fetching entries.');
  }
};

exports.createEntry = async (req, res) => {
  try {
    const { caption, date } = req.body;

    let data = {}
    if(req.file) {
        data = req.file
        console.log(req.file)
    }

    const index = data.mimetype.indexOf('/');
    const mediaType = data.mimetype.substring(0, index);

    // Create a new instance of the Entry model with the data from the request
    const newEntry = new Entries({
      caption,
      date,
      mediaType,
      url: data.location,
    });

    // Save the new entry to the database
    await newEntry.save();

    res.status(201).send('Entry saved successfully.');
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).send('An error occurred while saving the entry.');
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { caption } = req.body;

    // Find the entry by its entryId and update the fields
    const updatedEntry = await Entries.findOneAndUpdate(
      { _id: entryId }, // The filter to find the entry based on its _id
      { caption }, // The updated fields
      { new: true } // Option to return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).send('Entry not found.');
    }

    res.send(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).send('An error occurred while updating the entry.');
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    const deletedEntry = await Entries.findByIdAndRemove(entryId);

    if (!deletedEntry) {
      return res.status(404).send('Entry not found.');
    }

    res.send(`Entry with ID ${entryId} has been deleted.`);
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).send('An error occurred while deleting the entry.');
  }
};


exports.addCommentToEntry = async (req, res) => {
  try {
    const { entryId } = req.params; // Get the entryId from the request params
    const { comment } = req.body; // Get the comment from the request body

    // Find the entry by its entryId
    const entry = await Entries.findById(entryId);

    if (!entry) {
      return res.status(404).send('Entry not found.');
    }

    // Add the new comment to the entry's comments array
    entry.comments.push({ comment });

    // Save the updated entry to the database
    await entry.save();

    res.status(201).send('Comment added successfully.');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('An error occurred while adding the comment.');
  }
};

exports.deleteCommentFromEntry = async (req, res) => {
  try {
    const { entryId, commentId } = req.params; // Get the entryId and commentId from the request params

    // Find the entry by its entryId
    const entry = await Entries.findById(entryId);

    if (!entry) {
      return res.status(404).send('Entry not found.');
    }

    // Find the index of the comment in the entry's comments array
    const commentIndex = entry.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).send('Comment not found.');
    }

    // Remove the comment from the comments array
    entry.comments.splice(commentIndex, 1);

    // Save the updated entry to the database
    await entry.save();

    res.send('Comment deleted successfully.');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('An error occurred while deleting the comment.');
  }
};



