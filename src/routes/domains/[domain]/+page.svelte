<script>
	import { goto } from '$app/navigation';
	export let data;
	console.log(data.domain.record);
</script>

<h2 class="h2">{data.domain.name}.is-a.dev</h2>
<br />
<button class="btn variant-filled">
	Edit Record(s)  - Coming Soon
</button>
<br />
<button class="btn terminal-font variant-filled-error text-center textnexttext mt-4" on:click={() => goto(`/domains/${data.domain.name}/delete`)}>
	Delete Domain
</button>
