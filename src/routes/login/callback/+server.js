import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ url, cookies }) {
	let query = url.searchParams.get('code');
	if (!query) return new Response('The code was not found in the request', { status: 400 });

	//authorize with github
	let token = await fetch(
		`https://github.com/login/oauth/access_token?client_id=${env.GITHUB_CLIENT_ID}&client_secret=${env.GITHUB_CLIENT_SECRET}&code=${query}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	).then((res) => res.json());
	if (!token.access_token)
		return new Response('The access token was not found in the response', { status: 400 });

	//get user data
	let user = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `token ${token.access_token}`
		}
	}).then((res) => res.json());
	if (user.message === 'Bad credentials') {
		return new Response('The generated token was invalid', { status: 400 });
	}

	//get emails
	let emails = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `token ${token.access_token}`
		}
	}).then((res) => res.json());
	if (emails.message === 'Bad credentials') {
		return new Response('The generated token was invalid', { status: 400 });
	}

	//create a jwt
	let jwt = sign(
		{
			user: user,
			token: token.access_token,
			emails: emails
		},
		env.JWT_SECRET,
		{
			expiresIn: '8h'
		}
	);

	//set the cookie
	cookies.set('jwt', jwt, {
		httpOnly: true,
		path: '/',
		maxAge: 60 * 60 * 8
	});
	cookies.set('welcome', true, {
		httpOnly: false,
		path: '/',
		maxAge: 60 * 60 * 8
	});

	if (url.searchParams.get('next')) throw redirect(303, url.searchParams.get('next'));
	else throw redirect(303, '/');
}
