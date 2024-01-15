import { redirect } from '@sveltejs/kit';
import { getJWT } from '$lib/jwt.js';
import { CountDomains } from '$lib/api.js';

export async function load({ cookies }) {
	let user = await getJWT(cookies.get('jwt'));
	if (user) throw redirect(303, '/');

	let stats = await CountDomains();

	return {
		stats
	};
}
