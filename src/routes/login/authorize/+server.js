import { json } from '@sveltejs/kit';
import { getJWT, createJWT } from '$lib/jwt.js';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
export function GET({ url, cookies }) {
	let next = url.searchParams.get('next');
	if (!next) return json({ error: 'No next URL provided' });
	let provider = url.searchParams.get('provider');
	if (!provider) return json({ error: 'No provider provided' });
	if (!env[`PROVIDER_${provider.toUpperCase()}_SECRET`])
		return json({ error: 'Invalid provider provided' });
	let session = getJWT(cookies.get('jwt'));
	if (!session)
		throw redirect(
			303,
			`/login/in?next=${encodeURIComponent(
				`/login/authorize?next=${encodeURIComponent(next)}&provider=${provider}`
			)}`
		);
	let jwt = createJWT(session, env[`PROVIDER_${provider.toUpperCase()}_SECRET`]);
	throw redirect(303, `${next}?jwt=${jwt}`);
}
