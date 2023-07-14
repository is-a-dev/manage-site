<script>
	import { onMount } from 'svelte';
	export let data;
</script>

<h2 class="h2">
	Welcome {data.user.name || data.user.login}!
</h2>
<p class="text-lg text-center">
	{data.stats.individualOwners}
	people have already registered {data.stats.subdomains} subdomains!
</p>
