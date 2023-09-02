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

	let availableRecords = [
		{
			type: 'CNAME',
			allowMultiple: false
		},
		{
			type: 'A',
			allowMultiple: true
		},
		{
			type: 'URL',
			allowMultiple: false
		},
		{
			type: 'MX',
			allowMultiple: true
		},
		{
			type: 'TXT',
			allowMultiple: true
		}
	];
	records.forEach((r) => {
		r.allowMultiple = availableRecords.find((ar) => ar.type === r.type).allowMultiple;
	});
</script>

<h2 class="h2">Editing {data.domain.name}.is-a.dev</h2>
<br />
{#if !saving}
	<div in:fade={{ duration: 300 }} class="flex flex-col gap-5">
		<select
			class="select mb-2"
			on:change={(e) => {
				//if now selected value is not empty, add it to records
				if (e.target.value !== '')
					records = [...records, availableRecords.find((r) => r.type === e.target.value)];

				e.target.value = '';
			}}
		>
			<option value="" selected disabled> Add record </option>
			{#each availableRecords as record}
				{#if (!record.allowMultiple && records.find((r) => r.allowMultiple === false)) || records.find((r) => r.type === record.type)}
					<option value="" disabled>{record.type}</option>
				{:else}
					<option value={record.type}>{record.type}</option>
				{/if}
			{/each}
		</select>
		{#if records.length > 0}
			{#each records as record}
				<div class="flex items-center gap-2">
					<label class="label" for={record.type}>{record.type}</label>
					<input
						class="input"
						type="text"
						placeholder={record.type}
						id={record.type}
						value={record.value || ''}
						on:change={(e) => (record.value = e.target.value)}
					/>
					<button
						class="btn variant-filled-error"
						on:click={() => (records = records.filter((r) => r.type !== record.type))}
					>
						<Fa icon={faXmark} />
					</button>
				</div>
			{/each}

			<button
				class="btn variant-filled-success mt-5"
				on:click={async () => {
					saving = true;
					let toFetch = `/api/domains/${data.domain.name}/edit?`;

					let toAdd = {
						records: JSON.stringify(records)
					};
					for (const [key, value] of Object.entries(toAdd)) {
						toFetch += `${key}=${value}&`;
					}

					let response = await fetch(toFetch, {
						method: 'PATCH'
					})
						.then((res) => res.json())
						.catch((err) => {
							console.error(err);
							return { error: true };
						});
					if (response.error) {
						toastStore.trigger({
							background: 'variant-filled-error',
							message: `${response.error}`,
							timeout: 3000
						});
						saving = false;
						return;
					}
					saving = false;
					toastStore.trigger({
						background: 'variant-filled-success',
						message: `Successfully updated records.`,
						timeout: 3000
					});
					goto('/domains/' + data.domain.name);
				}}>Save</button
			>
		{:else}
			<p>Add a record to your domain to get started.</p>
		{/if}
	</div>
{:else}
	<div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="flex flex-col gap-5">
		<ProgressRadial class="mt-5" size="small" />
	</div>
{/if}
