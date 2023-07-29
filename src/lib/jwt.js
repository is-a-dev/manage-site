import jsonwebtoken from 'jsonwebtoken';
const { verify, sign } = jsonwebtoken;
import { env } from '$env/dynamic/private';

export function getJWT(jwt) {
	//verify the jwt
	let response = verify(jwt, env.JWT_SECRET, (err, response) => {
		if (err) {
			return null;
		}
		return response;
	});
	return response || null;
}

export function createJWT(data, secret = env.JWT_SECRET, options = {}) {
	return sign(data, secret, options);
}
