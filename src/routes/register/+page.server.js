import { redirect } from '@sveltejs/kit';
import { getJWT } from '$lib/jwt.js';

export async function load({ cookies }) {
	let user = await getJWT(cookies.get('jwt'));
	if (!user) throw redirect(303, '/login');
	return {
		user: user.user,
		token: user.token,
		emails: user.emails
	};
}
