import { getJWT } from '$lib/jwt.js';
import { redirect } from '@sveltejs/kit';
import { DomainInfo } from '$lib/api.js';
import { getHosting } from '$lib/api.js';
export async function load({ cookies, params }) {
	let jwt = cookies.get('jwt');
	let user = getJWT(jwt);
	if (!user) throw redirect(303, '/login');
	let hosting = await getHosting(jwt, params.domain);
	let domain = await DomainInfo(params.domain);
	if (domain.error) throw redirect(303, '/domains');
	if (domain.owner.username.toLowerCase() !== user.user.login.toLowerCase())
		throw redirect(303, '/domains');
	return {
		user: user.user,
		domain: {
			name: params.domain,
			...domain
		},
		hosting: hosting,
		jwt: jwt
	};
}
