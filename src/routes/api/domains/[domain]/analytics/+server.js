import { generateLink, registerSite } from '$lib/plausible.js'
import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {getJWT} from '$lib/jwt.js';
import { DomainInfo } from '$lib/api.js';
export async function GET({params, cookies}){
    let jwt = cookies.get('jwt');
    let session = await getJWT(jwt);
    if(!session) return json({error: 'User not signed in'}, 400);

    let domain = params.domain;
    if(!domain) return json({error: 'No domain provided'}, 400);

    let domainInfo = await DomainInfo(domain);
    if(!domainInfo) return json({error: 'No domain found'}, 400);
    if(domainInfo.owner.username !== session.user.login) return json({error: 'You do not own this domain'}, 400);

    await registerSite(domain);
    let result2 = await generateLink(domain);
    throw redirect(303, result2.url);
}