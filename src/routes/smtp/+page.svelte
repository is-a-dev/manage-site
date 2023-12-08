<script>
    import { onMount } from 'svelte';
    
    import { Modal } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

    export let data;

    let JWT = data.JWT;
    let password = '';
    let domain = '';

	console.log(data.domains)

    // Function to handle form submission
    const submitForm = async () => {
        try {
            const apiEndpoint = 'https://hosts.is-a.dev/api/SMTP?jwt=' + JWT + '&password=' + password + '&domain=' + domain + '&action=save';

            // Make a GET request to the API endpoint
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle the response (you can check status, etc.)
            if (response.ok) {
                console.log('Password saved successfully');
                alert('Password saved successfully');
            } else {
                alert('Failed to save password');
                console.error('Failed to save password');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    onMount(() => {
        // Additional logic to run when the component mounts
    });
</script>

<!-- Heading for SMTP settings -->
<h2 class="h2">SMTP settings</h2>
<br />

{#if data && data.domains && data.domains.length > 0}
    <!-- Form for setting SMTP password -->
    <form on:submit|preventDefault={submitForm}>
        <label class="label center">
            <span class="text-center">Select a domain</span>
            <!-- Dropdown listing domains -->
            <select bind:value={domain} class="input">
                {#each data.domains as { domain, record } (domain)}
                    <option value={domain}>{domain}</option>
                {/each}
            </select>
        </label>
        <label class="label center">
            <span class="text-center">Set a SMTP password</span>
            <!-- Input field for the password -->
            <input bind:value={password} class="input" type="password" placeholder="Password Here please" />
        </label>
        <!-- Button to save the password (changed type to submit) -->
        <button type="submit" class="btn variant-filled">Save Password</button>
    </form>
    <br />
    <button
        class="btn variant-filled mb-2"
        on:click={() => {
            //<script defer data-domain="{data.domain.name}.is-a.dev" src="{env.PUBLIC_ANALYTICS_URL}/js/script.js"></script>
            modalStore.trigger({
                type: 'alert',
                title: 'How to use SMTP',
                body: `To connect to our SMTP server, you can use the following settings:
                <br /><br />
                <code>Host: hosts.is-a.dev</code><br />
                <code>Port: 25</code><br />
                <code>Email: anything @ your subdomain .is-a.dev</code><br />
                <code>Username: domain without the .is-a.dev part</code><br />
                <code>Password: Set by User</code><br />
    `
            });
        }}
    >
        How to use SMTP
    </button>
{:else}
    <!-- Display a message if there are no domains or data is undefined -->
    <p class="text-center">You have no domains yet. <a href="/register">Let's change that!</a></p>
{/if}
