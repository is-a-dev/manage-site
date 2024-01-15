import { getJWT } from '$lib/jwt.js';
import { json } from '@sveltejs/kit';
import { DeleteDomain, getUser, getEmail } from '$lib/api.js';

export async function DELETE({ url, cookies, params }) {
	let jwt = cookies.get('jwt');
	let session = await getJWT(jwt);
	let apiKey;

	let query = url.searchParams;

	if (!session && query.get('key')) apiKey = query.get('key');
	else if (!session) return json({ error: 'No session or api key provided' }, 400);
	else apiKey = session.token;

	let user;
	if (session?.user) user = session.user;
	else user = await getUser(apiKey);

	let username;
	if (session?.user?.login) username = session.user.login;
	else username = user.login;

	if (!username) return json({ error: 'Invalid API key.' }, 400);

	let email;
	if (session?.emails) email = session.emails.find((email) => email.primary);
	else email = await getEmail(apiKey);
	email = email.email;

	if (!email) return json({ error: 'No primary email found.' }, 400);

	const subdomain = params.domain;

	const result = await DeleteDomain(apiKey, username, email, subdomain);
	// if result json contains ERROR, send error
	if (result.error) return json(result, 400);
	else return json(result, 200);
}
