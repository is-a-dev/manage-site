<script>
	import { Table } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faGear } from '@fortawesome/free-solid-svg-icons';
	export let data;

	const source = {
		head: ['Domain', 'Records', 'Actions'],
		body: data.subdomains.map((domain) => {
			return [
				domain.domain,
				domain.record.map((record) => `${record.type} ${record.value}`).join(', '),
				`<a href="/domains/${domain.domain.split('.is-a.dev')[0]}">Edit</a>`
			];
		})
	};
</script>

<h2 class="h2">Your Domains ({data.count})</h2>
<br />

{#if data.count === 0}
	<p class="text-center">You have no domains yet. <a href="/register">Let's change that!</a></p>
{:else}
	<Table {source} />
{/if}
