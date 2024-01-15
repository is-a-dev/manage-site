import { getJWT } from '$lib/jwt.js';
import { redirect } from '@sveltejs/kit';
import { DomainInfo, Maintainer } from '$lib/api.js';

export async function load({ cookies, params }) {
	let jwt = cookies.get('jwt');
	let user = getJWT(jwt);
	if (!user) throw redirect(303, '/login');
	let Maintainers = await Maintainer(user.user.login);
	if (!Maintainers) throw redirect(303, '/');
	let domain = await DomainInfo(params.domain);
	if (domain.error) throw redirect(303, '/domains');
	return {
		user: user.user,
		domain: {
			name: params.domain,
			...domain
		},
		emails: user.emails,
		token: user.token
	};
}
