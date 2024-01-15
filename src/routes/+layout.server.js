import { getJWT } from '$lib/jwt.js';
import { Maintainer } from '$lib/api.js';
export async function load({ cookies }) {
	let user = await getJWT(cookies.get('jwt'));
	let maintainer = true;
	if (user) {
		let Maintainers = await Maintainer(user.user.login);
		//if Maintainers is true then return false
		if (!Maintainers) maintainer = false;
		else maintainer = true;
	}

	return {
		user,
		maintainer
	};
}
