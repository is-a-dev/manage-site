<script>
	import { env } from '$env/dynamic/public';

	import { goto } from '$app/navigation';

	import { faSpinner } from '@fortawesome/free-solid-svg-icons';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	export let data;
	console.log(data.domain.record);
	let loading = false;
	import { modalStore } from '@skeletonlabs/skeleton';
	export let data;
	console.log(data.domain.record);
	const deleteModal = {
		type: 'confirm',
		title: 'Are you	sure you want to delete this domain?',
		body: 'This is your last chance to back out.',
		response: async (r) => {
			if (r) {
				let toFetch = `/api/domains/${data.domain.name}/delete?`;

				let response = await fetch(toFetch, {
					method: 'DELETE',
				})
					.then((res) => res.json())
					.catch((err) => {
						console.log(err);
						return { error: 'An error occurred while deleting the domain.' };
					});
				console.log(response);
				if (response.prurl) {
					modalStore.trigger({
						type: 'alert',
						title: 'Domain Deleted',
						body: 'The domain has been scheduled for deletion.',
						response: () => {
								goto('/domains');
						}
					});
				} else {
					modalStore.trigger({
						type: 'alert',
						title: 'Error',
						body: response.error,
					});
				}
			}
		}
	};

</script>

<Modal />
<h2 class="h2">{data.domain.name}.is-a.dev</h2>
<br />

<button class="btn variant-filled mb-2" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit Record(s)
<button class="btn variant-filled" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit record(s)
</button>
<br />
<button
	class="btn terminal-font variant-filled-error text-center textnexttext mt-4"
	on:click={() => {
		modalStore.trigger(deleteModal);
	}}
>
	Delete domain
</button>
<button
	class="btn variant-filled"
	on:click={() => {
		if (loading) return;
		loading = true;
		goto(`/api/domains/${data.domain.name}/analytics`);
	}}
>
	{#if loading}
		<Fa icon={faSpinner} spin size="lg" />
	{:else}
		Analytics
	{/if}
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
  
