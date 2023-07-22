<script>
	import { env } from '$env/dynamic/public';

	import { goto } from '$app/navigation';
	import { faSpinner } from '@fortawesome/free-solid-svg-icons';
	import { Modal } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	import { fade } from 'svelte/transition';
	import Fa from 'svelte-fa';
	export let data;
	console.log(data.domain.record);
	let analyticsOpen = false;
	let analyticsURL;
</script>

{#if analyticsOpen}
	<div
		class="fixed inset-0 z-50 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center"
		out:fade={{ duration: 150 }}
		in:fade={{ duration: 150 }}
	>
		<button
			class="absolute top-0 right-2 p-3 text-white text-2xl"
			on:click={() => {
				analyticsOpen = false;
			}}>✕</button
		>
		<iframe
			class="w-screen h-screen aspect-video rounded-container-token overflow-hidden"
			src={analyticsURL}
			title="Analytics"
			frameborder="0"
		/>
	</div>
{/if}
<Modal />
<h2 class="h2">{data.domain.name}.is-a.dev</h2>
<br />
<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit Record(s)
</button>
<button
	class="btn variant-filled mb-2"
        hidden
	on:click={async () => {
		let response = await fetch(
			`https://hosts.is-a.dev/api/register?jwt=${data.jwt}&domain=${data.domain.name}`
		);
		response = await response.json();
		if (response.error && response.error !== 'Domain already exists') {
			modalStore.trigger({
				type: 'alert',
				title: 'Error',
				body: response.error
			});
		} else {
			modalStore.trigger({
				type: 'confirm',
				title: 'Success',
				body: 'Your domain has been registered successfully. Do you want to automatically update your DNS records? Note: this will overwrite <b>all</b> your DNS records.',
				response: async (r) => {
					if (r) {
						console.log('confirm');
						let records = [
							{
								type: 'CNAME',
								value: 'hosts.is-a.dev'
							}
						];

						let toFetch = `/api/domains/${data.domain.name}/edit?`;

						let toAdd = {
							records: JSON.stringify(records)
						};
						for (const [key, value] of Object.entries(toAdd)) {
							toFetch += `${key}=${value}&`;
						}

						let response = await fetch(toFetch, {
							method: 'PATCH'
						})
							.then((res) => res.json())
							.catch((err) => {
								console.error(err);
								return { error: true };
							});
						if (response.error) {
							modalStore.trigger({
								type: 'alert',
								title: 'Failed to automatically update DNS records',
								body: response.error
							});
							return;
						} else {
							modalStore.trigger({
								type: 'alert',
								title: 'Successfully updated DNS records',
								body: 'A PR for updating your DNS records has been created!'
							});
							window.open(response.prurl, '_blank');
						}
					} else {
						modalStore.trigger({
							type: 'alert',
							title: 'Failed to automatically update DNS records',
							body: 'You can manually update your DNS records by adding a CNAME record with the value <code>hosts.is-a.dev</code>.'
						});
					}
				}
			});
		}
	}}
>
	Create webserver
</button>
<button
	class="text-sm text-gray-500 mt-1 mb-2"
	on:click={() => {
		//<script defer data-domain="{data.domain.name}.is-a.dev" src="{env.PUBLIC_ANALYTICS_URL}/js/script.js"></script>
		modalStore.trigger({
			type: 'alert',
			title: 'How to manage files',
			body: `To manage files, you need to connect using FTP (you can use an online FTP client) using the following credentials:
			<br /><br />
			<code>Host: hosts.is-a.dev</code><br />
			<code>Port: 21</code><br />
			<code>Username: ${data.domain.name}</code><br />
			<code>Password: 12345</code><br />
`
		});
	}}
>
	how to manage files
</button>
<button
	class="btn variant-filled"
	on:click={async () => {
		let analyticsResponse = await fetch(`/api/domains/${data.domain.name}/analytics`).then((r) =>
			r.json()
		);
		if (analyticsResponse.url) {
			analyticsURL = analyticsResponse.url;
			analyticsOpen = true;
		} else
			modalStore.trigger({
				type: 'alert',
				title: 'Analytics not available',
				body: analyticsResponse.error
			});
	}}
>
	Analytics
</button>
<button
	class="text-sm text-gray-500 mt-2"
	on:click={() => {
		//<script defer data-domain="{data.domain.name}.is-a.dev" src="{env.PUBLIC_ANALYTICS_URL}/js/script.js"></script>
		modalStore.trigger({
			type: 'alert',
			title: 'How to set up analytics',
			body: `To set up analytics, you need to add the following HTML code to your website: <br /><br /><code>&lt;script defer data-domain="${data.domain.name}.is-a.dev" src="${env.PUBLIC_ANALYTICS_URL}/js/script.js"&gt;&lt;/script&gt;</code>`
		});
	}}
>
	how to set up analytics
</button>
