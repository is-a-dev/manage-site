<script>
	export let data;
	console.log(data);
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fly, fade } from 'svelte/transition';
	let availableStatus = 'Start typing';
	let availableStatusClasses = '';
	let available = false;
	let domain;
	let recordType;
	let recordValue;
	let prURL;
	let page = 1;
	let error;
	let toFetch;

	let loaded = false;

	async function registerHosting(domain){
		let emailToUse = data.emails.find((email) => email.primary);
		let toFetch = `/api/domains/${domain}/host`;

		let response = await fetch(toFetch)
			.then((res) => res.json())
			.catch((err) => {
				page = 8;
			});
		console.log(response);
		if (response.prurl) {
			prURL = response.prurl;
			page = 7;
		} else {
			page = 8;
			error = response.error;
		}
	}

	async function register(domain, recordType, recordValue) {
		let emailToUse = data.emails.find((email) => email.primary);
		let toFetch = `/api/domains/${domain}/register?`;
		let toAdd = {
			type: recordType,
			content: recordValue
		};
		for (const [key, value] of Object.entries(toAdd)) {
			toFetch += `${key}=${value}&`;
		}

		let response = await fetch(toFetch)
			.then((res) => res.json())
			.catch((err) => {
				page = 8;
			});
		console.log(response);
		if (response.prurl) {
			prURL = response.prurl;
			page = 7;
		} else {
			page = 8;
			error = response.error;
		}
	}
	onMount(async () => {
		await fetch('/api/fork').then((res) => {
			if (res.status === 200) {
				page = 1;
				loaded = true;
			} else {
				error = 'Error while forking the repo';
				page = 6;
			}
		});
	});
</script>

<!-- Input that looks like a terminal-->
<div class="flex flex-col items-center justify-center">
	<div class="flex flex-row items-center justify-center">
		<div class="pagesGrid">
			{#if !loaded}
				<div
					class="flex flex-col items-center justify-center"
					out:fly|local={{ y: -100, duration: 500 }}
				>
					<ProgressRadial />
					<br />
					<h1 class={`h1`}>Forking is-a-dev/register...</h1>
				</div>
			{/if}
			{#if page === 1 && loaded}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="flex flex-col items-center justify-center"
				>
					<h1 class="text-center terminal-font h1">It all starts right here.</h1>

					<div class="fixanimation text-center">
						<span class={`terminal-font ${availableStatusClasses} duration-300`}>$</span>
						<input
							bind:value={domain}
							class={`terminal-font bg-transparent border-none border-0 text-2xl ${availableStatusClasses} hideborder transition-colors duration-300 focus:ring-transparent`}
							type="text"
							minlength="2"
							placeholder="johndoe"
							autofocus
							on:input={async (e) => {
                                                                e.target.value = e.target.value.toLowerCase();
								if (!e.target.value || e.target.value === '' || e.target.value.length < 2 ) {
									availableStatus = 'Start typing';
									availableStatusClasses = '';
									available = false;
									return;
								}
								//remove spaces
								e.target.value = e.target.value.replace(/\s/g, '');
								available = false;
								if (
									!toFetch &&
									(
										await fetch(
											`https://raw.githubusercontent.com/${data.user.login}/register/main/README.md`
										)
									).status === 200
								)
									toFetch = 'user';
								else if (!toFetch) toFetch = 'main';
								fetch(
									toFetch === 'user'
										? `https://raw.githubusercontent.com/${data.user.login}/register/main/domains/${e.target.value}.json`
										: `https://raw.githubusercontent.com/is-a-dev/register/main/domains/${e.target.value}.json`
								).then((res) => {
									if (res.status === 404) {
										availableStatus = 'Available!';
										availableStatusClasses = 'green';
										available = true;
									} else if (res.status === 200) {
										availableStatus = 'Taken!';
										availableStatusClasses = 'red';
										available = false;
									} else {
										availableStatus = 'Error!';
										availableStatusClasses = 'red';
										available = false;
									}
								});
							}}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									if (available) {
										page = 2;
										setTimeout(() => {
											page = 3;
										}, 5000);
									} else {
										//shake the input
										e.target.classList.add('shake');
										setTimeout(() => {
											e.target.classList.remove('shake');
										}, 500);
									}
								}
							}}
						/>

						<button
							class="plausible-event-name=Enter+Domain btn text-2xl terminal-font ${!available ? 'disabled' : ''}"
							on:click={() => {
								if ( domain.length < 2) {
									alert("The domain name must be atleast two characters.");
									return;
								}
								if (available) {
									page = 2;
									setTimeout(() => {
										page = 3;
									}, 5000);
								} else {
									//shake the input
									document.querySelector('input').classList.add('shake');
									setTimeout(() => {
										document.querySelector('input').classList.remove('shake');
									}, 500);
								}
							}}
						>
							Next
						</button>
					</div>
				</div>
			{/if}
			{#if page === 2}
				<div
					in:fly|local={{ y: 100, duration: 1000, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<div class="textnext">
						<h2 class="h2 terminal-font text-center textnexttext">
							{domain}.is-a.dev
						</h2>
						<h2
							class="h2 terminal-font text-center textnexttext"
							in:fade|local={{ duration: 2000, delay: 1500 }}
						>
							is available!
						</h2>
						<p
							class="terminal-font text-center textnexttext h3"
							in:fade|local={{ duration: 2000, delay: 3000 }}
						>
							Let's set it up!
						</p>
					</div>
				</div>
			{/if}
			{#if page === 3}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<div class="textnext">
						<h2 class="h2 terminal-font text-center textnexttext">Record type</h2>
						<select
							class="terminal-font select w-full text-center textnexttext"
							bind:value={recordType}
							in:fade|local={{ duration: 2000, delay: 1500 }}
							on:change={() => {
								//if the user selects the hosting option, skip to page 5
								if (recordType === 'host') {
									page = 5;
								}
								else if (recordType) page = 4;
							}}
						>
							<option value="" disabled selected>Select record type</option>
							<option value="host">Hosting by is-a.dev</option>
							<option value="CNAME">CNAME</option>
							<option value="A">A</option>
							<option value="URL">URL</option>
							<option value="MX">MX</option>
							<option value="TXT">TXT</option>
						</select>
					</div>
				</div>
			{/if}
			{#if page === 4}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<div class="textnext flex flex-col items-center">
						<h2 class="h2 terminal-font text-center textnexttext">{recordType} value</h2>
						<input
							class="terminal-font text-center w-60 input"
							bind:value={recordValue}
							in:fade|local={{ duration: 2000, delay: 1500 }}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									if (recordValue) page = 5;
									else {
										//shake the input
										e.target.classList.add('shake');
										setTimeout(() => {
											e.target.classList.remove('shake');
										}, 500);
									}
								}
							}}
						/>
						{#if recordValue}
							<aside
								class="terminal-font text-center textnexttext alert"
								in:fade|local={{ duration: 2000, delay: 0 }}
								out:fade|local={{ duration: 1000, delay: 0 }}
							>
								Press enter to continue
							</aside>
						{/if}
					</div>
				</div>
			{/if}
			{#if page === 5}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<h2 class="h2 terminal-font text-center textnexttext">That's everything!</h2>
					<p
						class="terminal-font text-center textnexttext h3"
						in:fade|local={{ duration: 2000, delay: 1500 }}
					>
						Click the button below to set up your domain!
					</p>
					<div class="flex justify-center">
						<button
							class="plausible-event-name=Register+Domain btn text-2xl terminal-font variant-filled-error text-center textnexttext mt-4"
							in:fade|local={{ duration: 2000, delay: 3000 }}
							on:click={() => {
								page = 6;
								// if recordType is host, set recordValue to the hosting URL
								if (recordType === 'host') {
									registerHosting(domain);
								}
								else {
									register(domain, recordType, recordValue);
								}
								
							}}
						>
							Set up domain
						</button>
					</div>
				</div>
			{/if}
			{#if page === 6}
				<div
					class="flex justify-center"
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
				>
					<ProgressRadial />
				</div>
			{/if}
			{#if page === 7}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<div class="textnext">
						<h2 class="h2 terminal-font text-center textnexttext">Success!</h2>
						<p
							class="terminal-font text-center textnexttext h3"
							in:fade|local={{ duration: 2000, delay: 1500 }}
						>
							Your domain will now be reviewed by our team.
						</p>
						<p
							class="terminal-font text-center textnexttext h3"
							in:fade|local={{ duration: 2000, delay: 3000 }}
						>
							Click the button below to open the PR.
						</p>
						<div class="flex justify-center">
							<button
								class="btn text-2xl terminal-font variant-filled-error text-center textnexttext"
								in:fade|local={{ duration: 2000, delay: 4500 }}
								on:click={() => {
									window.open(prURL, '_blank');
								}}
							>
								Visit site
							</button>
						</div>
					</div>
				</div>
			{/if}
			{#if page === 8}
				<div
					in:fly|local={{ y: 100, duration: 500, delay: 500 }}
					out:fly|local={{ y: -100, duration: 500 }}
					class="fixanimation"
				>
					<div class="textnext">
						<h2 class="h2 terminal-font text-center textnexttext">Whoops!</h2>
						<p
							class="terminal-font text-center textnexttext h3"
							in:fade|local={{ duration: 2000, delay: 1500 }}
						>
							We couldn't set up your domain.
						</p>
						<p
							class="terminal-font text-center textnexttext h3"
							in:fade|local={{ duration: 2000, delay: 3000 }}
						>
							Error: {error}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.terminal-font {
		font-family: 'VT323', monospace;
	}
	.red {
		color: red;
	}
	.yellow {
		color: yellow;
	}
	.green {
		color: green;
	}
	input:focus {
		outline: none;
	}
	.fixAnimation {
		grid-row: 1;
		grid-column: 1;
	}
	.pagesGrid {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}
	.textnext {
		grid-row: 1;
		grid-column: 1;
	}
	.textnexttext {
		grid-row: 1;
		grid-column: 1;
	}
	.shake {
		animation: shake 0.5s;
	}
	@keyframes shake {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-10px);
		}
		50% {
			transform: translateX(10px);
		}
		75% {
			transform: translateX(-10px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
