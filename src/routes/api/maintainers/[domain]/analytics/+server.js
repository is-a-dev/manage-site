import { generateLink, registerSite } from '$lib/plausible.js';
import { json } from '@sveltejs/kit';
import { getJWT } from '$lib/jwt.js';
import { DomainInfo, Maintainer } from '$lib/api.js';
export async function GET({ params, cookies }) {
	let jwt = cookies.get('jwt');
	let session = await getJWT(jwt);
	if (!session) return json({ error: 'User not signed in' }, 400);

	let domain = params.domain;
	if (!domain) return json({ error: 'No domain provided' }, 400);

	let domainInfo = await DomainInfo(domain);
	if (!domainInfo) return json({ error: 'No domain found' }, 400);
	if (domainInfo.error) return json({ error: domainInfo.error }, 400);
	let Maintainers = await Maintainer(session.user.login);
	if (!Maintainers) return json({ error: 'User is not a maintainer' }, 400);
	console.log(domainInfo);

	await registerSite(domain);
	let result2 = await generateLink(domain);
	if (!result2 || !result2.url) return json({ error: 'Failed to generate link' }, 400);
	return json({ success: true, url: result2.url });
}
