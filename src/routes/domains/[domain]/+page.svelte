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

<br />
<!--
<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit Record(s)
</button>
-->

<!--
<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/delete`)}>
	Delete domain
</button>
-->


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
