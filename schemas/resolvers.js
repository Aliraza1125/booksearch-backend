const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        console.log("arg", args);
        const user = await User.create(args);
        const token = signToken(user);
        console.log("trying signup", token, user);

        // Send back an "ok" response along with token and user details
        return { ok: true, token, user };
      } catch (error) {
        console.error("Error during signup:", error);
        return { ok: false, error: "Signup failed" };
      }
    },

    login: async (parent, { email, password }) => {
      console.log("trying Loggin");
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      // Return an "ok" response for consistency
      return { ok: true, token, user };
    },

    saveBook: async (parent, { input }, context) => {
      console.log("try save");
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } }, // Change saveBooks to savedBooks
          { new: true }
        ).populate("savedBooks"); // Optional: Populating to get saved books data
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { saveBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
