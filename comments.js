// Create web server

// Import dependencies
const express = require("express");
const router = express.Router();

// Import models
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");

// Import middleware
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Import validation
const validateComment = require("../validation/comment");

// @route   POST /api/comments
// @desc    Create comment
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    // Validate input
    const { errors, isValid } = validateComment(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get user
    const user = await User.findById(req.user.id).select("-password");

    // Create comment
    const newComment = new Comment({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
      post: req.body.post
    });

    // Save comment
    const comment = await newComment.save();