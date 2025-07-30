import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../../modules/user/user.model";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done("Email not found");
        }
        const passwordMatch = await bcrypt.compare(
          password,
          user.password as string
        );

        if (!passwordMatch) {
          return done("Password does not match");
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize User (what to store in the session)
// Usually just the user ID

passport.serializeUser((user: any, done) => {
  done(null, user); // Store user ID in the session
});

// Deserialize User (how to retrieve user from the session)
// Fetch the full user object (without password) from the ID stored in session

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
