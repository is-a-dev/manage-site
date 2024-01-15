import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
	await cookies.set('jwt', '', {
		httpOnly: true,
		path: '/',
		maxAge: 0
	});
	throw redirect(303, '/');
}
