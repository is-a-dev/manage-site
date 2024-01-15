import { json } from '@sveltejs/kit';
import { getJWT } from '$lib/jwt.js';
import { forkRepo } from '$lib/api.js';
export async function GET({ cookies, url }) {
	let apiKey;

	let jwt = cookies.get('jwt');
	let session = getJWT(jwt);

	if (!session && url.searchParams.get('apikey')) apiKey = url.searchParams.get('key');
	else if (!session) return json({ error: 'No session or api key provided' }, 400);
	else apiKey = session.token;

	let response = await forkRepo(apiKey);

	if (response.error) return json(response, 400);
	else return json(response, 200);
}
