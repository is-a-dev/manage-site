<script>
	import { goto } from '$app/navigation';
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

<h2 class="h2">{data.domain.name}.is-a.dev</h2>
<br />
<button class="btn variant-filled" on:click={() => goto(`/domains/${data.domain.name}/edit`)}>
	Edit Record(s)
</button>
<br />
<button
	class="btn terminal-font variant-filled-error text-center textnexttext mt-4"
	on:click={() => {
		modalStore.trigger(deleteModal);
	}}
>
	Delete Domain
</button>
