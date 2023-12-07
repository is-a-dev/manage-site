<script>
	import { Table } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faBookReader, faGear } from '@fortawesome/free-solid-svg-icons';
	export let data;

	
</script>

<h2 class="h2">SMTP settings</h2>
<br />

{#if data.count === 0}
	<p class="text-center">You have no domains yet. <a href="/register">Let's change that!</a></p>
{:else}

	<p class="text-center">Coming soon</p>

{/if}
