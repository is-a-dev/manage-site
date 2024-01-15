import { DomainInfo, ListDomains } from '$lib/api.js';
import { json } from '@sveltejs/kit';
export async function GET({ url }) {
	let query = url.searchParams;
	const domain = query.get('domain');
	const username = query.get('username');
	if (domain) {
		let domains = await DomainInfo(domain);
		if (domains.error) return json(domains, 404);
		else {
			return json(domains, 200);
		}
	} else if (username) {
		return json(await ListDomains(username), 200);
	} else {
		return json({ error: 'No domain or username provided' }, 400);
	}
}
