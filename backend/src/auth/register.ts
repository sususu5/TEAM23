import {
	generateRandomToken,
	getHashedPassword,
	containsValidName,
	validPassword, 
	generateRandomUserId
} from '../helperFunction';
import { getData, setData } from '../dataStore';

// defined constants
const minNameLength = 2;
const maxNameLength = 20;

/**
 * Register a new user and return a token
 * The password should be hashed before being stored in the database!!! 
 * @param {string} username 
 * @param {string} password 
 * @returns {string} token
 */
export async function register(username: string, password: string, avatar: string)
: Promise<{ token: string } | { error: string }> {
  
  const data = await getData();
  // if nameFirst or nameLast contains characters other than
  // lower/upper case letters spaces, hyphens or apostrophes --> error
  if (!containsValidName(username)) {
    return {
    error: 'username contains restricted characters.'
    };
  }

  // if nameFirst or nameLast is less than 2 characters or more than 20
  // characters --> error
  if (username.length < minNameLength || username.length > maxNameLength) {
    return { error: 'username must be between 2 and 20 characters.' };
  }

	// check for invalid password 
  if (!validPassword(password)) {
    console.log("password is ", password);
    console.log("password is ", password.length);
		return {error: 'Password must be at least 8 characters long and contain at least one number and 2 letters.'};
	}

  // check if username already exists 
  const existingUser = data.users.find(user => user.username === username);
  if (existingUser) {
    return { error: 'username already exists.' };
  }

  // if no errors occured, we can register the user
  // we will generate an ID based on the number of users
  const userId = generateRandomUserId(data);
	const token = generateRandomToken();
	const hashedPassword = getHashedPassword(password)
  
	const newUser = {
    userId,
		token: [token],
		username: username,
		avatar: avatar,
		password: hashedPassword,
		usedPassword: [hashedPassword]
  };

  data.users.push(newUser);
	await setData(data);

  return {token};
}

