import { getJWT } from '$lib/jwt.js'
import { redirect } from '@sveltejs/kit'
import {ListDomains, Maintainer} from '$lib/api.js'
export async function load({cookies}){
    let jwt = cookies.get('jwt');
    let user = getJWT(jwt);
    if(!user) throw redirect(303, '/login');
    let Maintainers = await Maintainer(user.user.login);
    if(!Maintainers) throw redirect(303, '/');
    let domains = await ListDomains("is-a-dev");


    return {
        user: user.user,
        subdomains: domains,
        count: domains.length || 0
    };
}