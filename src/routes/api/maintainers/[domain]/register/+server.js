import { getJWT } from '$lib/jwt.js';
import { json } from '@sveltejs/kit';
import { RegisterDomain, getUser, getEmail } from '$lib/api.js';

export async function GET({ url, cookies, params }) {
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

	if (!email) return json({ error: 'No primary email found.' }, 400);
	email = email.email;

	const type = query.get('type');
	const content = query.get('content');
	let subdomain = params.domain;
	//make subdomain lowercase
	subdomain = subdomain.toLowerCase();

	if (!type || !content) return json({ error: 'Missing type and/or content' }, 400);

	const result = await RegisterDomain(subdomain, type, username, email, apiKey, content);
	// if result json contains ERROR, send error
	if (result.error) return json(result, 400);
	else return json(result, 200);
}
