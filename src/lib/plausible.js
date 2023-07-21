import { env } from '$env/dynamic/private'; 

function isRegistered(subdomain){
    return fetch(`${env.PLAUSIBLE_API_PATH}/sites/${subdomain}.is-a.dev`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.PLAUSIBLE_API_KEY}`
        }
    }).then(response => {
        if(response.status === 200){
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        console.log(error);
        return false;
    });
}

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
    generateLink,
    isRegistered
}