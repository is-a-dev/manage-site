import { ListDomains } from '$lib/api.js';
import { json } from '@sveltejs/kit';
export async function GET({ params }) {
	let user = params.user;
	let domains = await ListDomains(user);
	return json({
		domains
	});
}
