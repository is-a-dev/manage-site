import { CheckDomain } from '$lib/api.js';
import { json } from '@sveltejs/kit';
export async function GET({ params }) {
	let domain = params.domain;
	if (!domain) return json({ error: 'No domain provided' }, 400);
	let result = await CheckDomain(domain);
	return json(
		{
			available: result
		},
		200
	);
}
