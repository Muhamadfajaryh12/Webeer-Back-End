const { ObjectId } = require('mongodb');
const Discussion = require('../models/discussion.js');
const Category = require('../models/discussionCategory.js');
const DiscussionReply = require('../models/discussionReply.js');
const User = require('../models/user.js');

const createDiscussion = async (req, res) => {
  const { user } = req;
  const discussionID = new ObjectId();
  const {
    title,
    discussion,
    categories,
  } = req.body;

  const nameuser = await User.findOne({
    _id: user,
  });
  const date = new Date();
  const reply = [];
  const isSolved = false;
  if (typeof (categories) === 'object') {
    categories.forEach(async (category) => {
      const isExist = await Category.findOne({
        name: category,
      });

      if (isExist !== null) {
        isExist.discussions.push(discussionID);
        await isExist.save();
      }
    });
  } else {
    const isExist = await Category.findOne({
      name: categories,
    });

    if (isExist !== null) {
      isExist.discussions.push(discussionID);
      await isExist.save();
    }
  }

  const newDiscussion = new Discussion({
    _id: discussionID,
    userid: user,
    username: nameuser.username,
    userimage: nameuser.image,
    date,
    title,
    categories,
    discussion,
    reply,
    isSolved,
  });

  const discuss = await newDiscussion.save();

  res.status(201).json({
    success: true,
    data: discuss,
  });
};

const getAllDiscussion = async (req, res) => {
  const { sort, category, search } = req.query;

  let discussions = await Discussion.find().sort({ date: -1 });

  if (sort !== undefined) {
    if (sort === 'true') {
      discussions = await Discussion.find().sort({ isSolved: -1, date: -1 });
    } else if (sort === 'false') {
      discussions = await Discussion.find().sort({ isSolved: 1, date: -1 });
    } else if (sort === 'oldest') {
      discussions = await Discussion.find().sort({ date: 1 });
    }
  }

  if (search !== undefined) {
    discussions = discussions.filter((discussion) => discussion.title.toLowerCase()
      .includes(search.toLowerCase()));
  }

  if (category !== undefined) {
    if ((typeof (category)).includes('object')) {
      category.forEach((categoryItem) => {
        discussions = discussions.filter((discussion) => discussion.categories
          .includes(categoryItem));
      });
    } else {
      discussions = discussions.filter((discussion) => discussion.categories.includes(category));
    }
  }
  res.json({
    success: true,
    data: discussions,
  });
};

const getDiscussion = async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findOne({
    _id: id,
  }).populate('discussion');

  res.json({
    success: true,
    data: discussion,
  });
};

const getDiscussionOtherUser = async (req, res) => {
  const user = req.params.id;

  const discussion = await Discussion.find({
    userid: user,
  }).sort({ date: -1 });

  res.json({
    success: true,
    data: discussion,
  });
};

const getUserDiscussion = async (req, res) => {
  const { user } = req;

  const discussion = await Discussion.find({
    userid: user._id,
  }).sort({ date: -1 });

  res.json({
    success: true,
    data: discussion,
  });
};

const editDiscussion = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const {
    title,
    categories,
    discussion,
    isSolved,
  } = req.body;

  const discussionId = await Discussion.findOne({
    _id: id,
  });

  if (user._id !== discussionId.userid) {
    res.status(400).json({
      error: true,
      message: 'There is an error',
    });
    return;
  }
  const date = new Date();

  const category = await Category.find({
    discussions: id,
  });

  const arrCategory = [];
  category.forEach((c) => {
    arrCategory.push(c.name);
  });

  let count = 0;
  if (typeof (categories) === 'object') {
    while (count < categories.length) {
      if (arrCategory.includes(categories[count]) === false) {
        const categoryNotAdded = await Category.findOne({
          name: categories[count],
        });

        categoryNotAdded.discussions.push(id);
        await categoryNotAdded.save();
      }

      count++;
    }
  } else if (arrCategory.includes(categories) === false) {
    const categoryNotAdded = await Category.findOne({
      name: categories,
    });

    categoryNotAdded.discussions.push(id);
    await categoryNotAdded.save();
  }

  count = 0;
  while (count < arrCategory.length) {
    if (categories.includes(arrCategory[count]) === false) {
      const categoryNotFound = await Category.findOne({
        name: arrCategory[count],
      });

      const index = categoryNotFound.discussions.findIndex((discussionsId) => discussionsId
        .toString() === id);

      if (index !== -1) {
        categoryNotFound.discussions.splice(index, 1);
      }

      await categoryNotFound.save();
    }
    count++;
  }

  const discuss = await Discussion.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title,
        categories,
        discussion,
        date,
        isSolved,
      },
    },
  );

  if (discuss) {
    res.status(201).json({
      success: true,
      data: discuss,
      message: 'You have successfully updated the discussion',
    });
  } else {
    res.status(400).json({
      error: true,
      message: 'You failed to update the discussion',
    });
  }
};

const deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const discussionId = await Discussion.findOne({
    _id: id,
  });

  if (user._id !== discussionId.userid) {
    res.status(400).json({
      success: false,
      message: 'Cannot delete this discussion',
    });
    return;
  }

  const discussion = await Discussion.findOneAndDelete({
    _id: id,
  });

  discussion.categories.forEach(async (discuss) => {
    const category = await Category.findOne({
      name: discuss.toLowerCase(),
    });

    const index = category.discussions.findIndex((discussionsId) => discussionsId
      .toString() === id);

    if (index !== -1) {
      category.discussions.splice(index, 1);
    }

    await category.save();
  });

  discussion.reply.forEach(async (discuss) => {
    await DiscussionReply.findOneAndDelete({
      _id: discuss,
    });
  });

  if (discussion) {
    res.send({
      success: true,
      message: 'Delete Successfully',
    });
  }
};
module.exports = {
  createDiscussion,
  getAllDiscussion,
  getUserDiscussion,
  getDiscussion,
  editDiscussion,
  deleteDiscussion,
  getDiscussionOtherUser,
};