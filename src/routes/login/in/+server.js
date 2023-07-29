import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
export async function GET({ url }) {
	let next = url.searchParams.get('next') || '/';
	let provider = url.searchParams.get('provider');
	throw redirect(
		303,
		`https://github.com/login/oauth/authorize?client_id=${
			env.GITHUB_CLIENT_ID
		}&scope=public_repo%20user:email&redirect_uri=${encodeURIComponent(
			`${url.protocol}//${url.host}/login/callback?next=${encodeURIComponent(
				next
			)}&provider=${encodeURIComponent(provider)}`
		)}`
	);
}
