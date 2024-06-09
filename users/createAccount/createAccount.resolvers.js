import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      try {
        //Check if userName or email are already on DB.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                userName,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }
        // hash password
        const uglyPassword = await bcrypt.hash(password, 10);
        // save and return User
        await client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return {
          ok : true,
        }
      } catch(e) {
        return {
          ok : false,
          error : "Can't create account"
        }
      }
    },
  },
};
