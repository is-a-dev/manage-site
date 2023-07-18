import { env } from '$env/dynamic/private'; 
async function registerSite(subdomain){
    let response = await fetch(`${env.PLAUSIBLE_API_PATH}/sites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.PLAUSIBLE_API_KEY}`
        },
        body: JSON.stringify({
            domain: `${subdomain}.is-a.dev`,
        })
    });
    let data = await response.json();
    return data;
    }
    async function generateLink(subdomain){
        let response = await fetch(`${env.PLAUSIBLE_API_PATH}/sites/shared-links`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.PLAUSIBLE_API_KEY}`
            },
            body: JSON.stringify({
                site_id: `${subdomain}.is-a.dev`,
                name: "View stats for owner of this domain",
            })
        });
        let data = await response.json();
        return data;
        }

export {
    registerSite,
    generateLink
}