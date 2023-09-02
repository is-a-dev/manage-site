<script>
	export let data;
	import { goto } from '$app/navigation';
	import Fa from 'svelte-fa';
	import { toastStore } from '@skeletonlabs/skeleton';

	//close icon
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	let saving = false;
	let records = data.domain.record || [];

	l
</script>

<h2 class="h2">Are you sure you want to delete {data.domain.name}.is-a.dev?</h2>
<br />

