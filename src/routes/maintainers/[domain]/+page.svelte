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
	let hosting = data.hosting;
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
{#if hosting}
<button
	class="btn variant-filled mb-2"
	on:click={() => {
		let pass = hosting.config.ftp_password;
		//<script defer data-domain="{data.domain.name}.is-a.dev" src="{env.PUBLIC_ANALYTICS_URL}/js/script.js"></script>
		modalStore.trigger({
			type: 'confirm',
			buttonTextConfirm: 'Online editor',
			buttonTextCancel: 'Close',
			title: 'How to manage files',
			response: (r) => {
				console.log('response:', r);
				if (r) {
					window.open("https://files.hosts.is-a.dev/");
				}
			},
			body: `To manage files you can use our online file editor or you can connect using FTP using the following credentials:
			<br /><br />
			<code>Host: hosts.is-a.dev</code><br />
			<code>Port: 21</code><br />
			<code>Username: ${data.domain.name}</code><br />
			<code>Password: ${pass}</code><br />
			<code>FTP Enabled: ${hosting.config.ftp}</code>
`
		});
	}}
>
	Manage files
</button>
{/if}
<br />
<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit Record(s)
</button>
{#if !hosting}
<br />
<p>HOSTING IS DISABLED ON STAFF DOMAINS</p>
<br />
<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/delete`)}>
	Delete domain
</button>
{/if}

<button
	class="btn variant-filled"
	on:click={async () => {
		let analyticsResponse = await fetch(`/api/maintainers/${data.domain.name}/analytics`).then((r) =>
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
