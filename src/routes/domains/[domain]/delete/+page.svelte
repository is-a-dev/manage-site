<script>
	export let data;
	import { goto } from '$app/navigation';
	import Fa from 'svelte-fa';
	//close icon
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { query_selector_all } from 'svelte/internal';

	let result = false;
	let page = 1;
</script>

{#if page === 1}
<h2 class="h2" in:fade|local={{ duration: 1000, delay: 500 }}>Are you sure you want to delete {data.domain.name}.is-a.dev?</h2>
<br />
<button class="btn variant-filled" in:fade|local={{ duration: 2000, delay: 1500 }} on:click={() => goto(`/domains/`)}>
	No
</button>
<br />
<button class="btn terminal-font variant-filled-error text-center textnexttext mt-4" in:fade|local={{ duration: 2000, delay: 3000 }} on:click={() => page=2}>
	Yep, I'm sure
</button>
{/if}

{#if page === 2}
<h2 class="h2" in:fade|local={{ duration: 1000, delay: 500 }}>Deleting {data.domain.name}.is-a.dev...</h2>

<br />
<ProgressRadial class="w-1/2" />
<br />
<script>
	// make a delete request to the api
	fetch('domains/' + data.domain.name + "/delete", 'DELETE').then((res) => {
		if (res.status === 200) {
			result = true;
			page = 3;
		} else {
			result = false;
			page = 3;
		}
	});
</script>
<br />
<button class="btn variant-filled" on:click={() => page=3}>
	No, wait!
</button>
					



{/if}

{#if page === 3}
<h2 class="h2" in:fade|local={{ duration: 1000, delay: 500 }}>Domain deleted!</h2>


{/if}

