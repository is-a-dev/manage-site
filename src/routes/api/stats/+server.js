import { CountDomains } from '$lib/api';
import { json } from '@sveltejs/kit';
export async function GET() {
	return json(await CountDomains());
}
