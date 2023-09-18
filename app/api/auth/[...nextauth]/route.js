import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        } else {
          throw new Error('User not found in the database');
        }

        return session;
      } catch (error) {
        console.error("Error retrieving user from the database for session:", error.message);
        return null; // Return null to destroy the session and log the user out
      }
    },
    async signIn({ account, profile }) {
      try {
        await connectToDB();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = new User({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });

          await user.save();
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error.message);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };
