import { DomainInfo } from '$lib/api.js';
import { json } from '@sveltejs/kit';
export async function GET({ params }) {
	let domain = params.domain;
	if (!domain) return json({ error: 'No domain provided' }, 400);
	let result = await DomainInfo(domain);
	return json(result, 200);
}
