const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }
      throw new AuthenticationError("You are not logged in");
    },
  },
  Mutation: {
    // pull args from user input to login user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      // check user name
      if (!user) {
        throw new AuthenticationError("username/password is incorrect");
      }
      // 
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("username/password is incorrect");
      }
      const token = signToken(user);

      return { token, user };
    },
    // pull args from user input to create user then turn user to receive token then return user and token as value
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    // pull user input from args and add to set return new true
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
    // pull book id from args to remove
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;