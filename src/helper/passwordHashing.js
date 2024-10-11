// import * as bcrypt from 'bcryptjs';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Function to hash a password
export default class Password {
    static async hashPassword(password){
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      }
      
      // Function to compare a plain text password with a hashed password
      static async comparePasswords(plainPassword, hashedPassword) {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
      }
}

