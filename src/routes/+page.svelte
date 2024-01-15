<script>
	import { toastStore } from '@skeletonlabs/skeleton';

	export let data;

	if (data.welcome)
		toastStore.trigger({
			background: 'variant-filled-success',
			message: `Signed in as ${data.user.name || data.user.login}!`,
			timeout: 3000
		});
</script>

<h2 class="h2">
	Welcome, {data.user.name || data.user.login}!
</h2>
<p class="text-lg text-center">
	{data.stats.subdomains} domains have been registered by {data.stats.individualOwners} people!
</p>
