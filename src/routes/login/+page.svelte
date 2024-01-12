<script>
	export let data;

	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="grid place-content-center place-items-center gap-4">
	<h1 class="h2 font-bold">Please sign in to continue.</h1>
	<p>
		{data.stats.individualOwners} people have already registered {data.stats.subdomains} subdomains!
	</p>
	<Button style="primary" className="" href="/login/in">
		<Fa icon={faGithub} size="lg" />
		Sign in with GitHub
	</Button>
</div>
