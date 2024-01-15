<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { AppRail, AppRailAnchor, Modal, Toast, modalStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import {
		faGlobe,
		faKeyboard,
		faLock,
		faEnvelope,
		faRightFromBracket
	} from '@fortawesome/free-solid-svg-icons';
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	export let data;
	let Maintainers = data.maintainer;
	let pathname = $page.url.pathname;
	let pages = [
		{
			name: 'Domains',
			path: '/domains',
			icon: faGlobe
		},
		{
			name: 'Register',
			path: '/register',
			icon: faKeyboard
		}
	];
</script>

<Modal />
<Toast />
<div class="grid grid-cols-[auto_1fr] w-full h-full">
	<AppRail class="overflow-hidden">
		<svelte:fragment slot="lead">
			<AppRailAnchor
				href="/"
				on:click={() => {
					pathname = '/';
				}}
			>
				<img src="/logo.png" alt="Logo" />
			</AppRailAnchor>
		</svelte:fragment>
		<!-- --- -->
		{#each pages as page}
			<AppRailAnchor
				href={page.path}
				selected={page.path === pathname}
				on:click={() => {
					pathname = page.path;
				}}
				hidden={page.hidden}
			>
				<div
					class={`flex flex-col items-center mb-4 rounded-md p-4`}
					style={`background-color: ${page.path === pathname ? '#6050A6' : 'transparent'}`}
				>
					<p class="text-2xl font-bold text-center flex justify-center items-center">
						<Fa icon={page.icon} />
					</p>
					<span>{page.name}</span>
				</div>
			</AppRailAnchor>
		{/each}
		<!-- <AppRailTile name="tile-1" title="tile-1" active={page.pathname !== '/domains'}>
			<svelte:fragment slot="lead">
				<p class="text-2xl font-bold text-center flex justify-center items-center">
					<Fa icon={faGlobe} />
				</p>
			</svelte:fragment>
			<span>Domains</span>
		</AppRailTile>
		<AppRailTile name="tile-2" title="tile-2" active={page.pathname !== '/register'}>
			<svelte:fragment slot="lead">
				<p class="text-2xl font-bold text-center flex justify-center items-center">
					<Fa icon={faKeyboard} />
				</p>
			</svelte:fragment>
			<span>Register</span>
		</AppRailTile>
		<AppRailTile name="tile-3" title="tile-3" active>
			<svelte:fragment slot="lead">(icon)</svelte:fragment>
			<span>?</span>
		</AppRailTile> -->
		<!-- --- -->
		<svelte:fragment slot="trail">
			{#if data.user}
				<AppRailAnchor
					title="Sign out"
					href="#"
					on:click={(e) => {
						e.preventDefault();
						modalStore.trigger({
							type: 'confirm',
							// Data
							title: 'Logging out',
							body: 'Are you sure you want to log out?',
							// TRUE if confirm pressed, FALSE if cancel pressed
							response: (r) => {
								if (r) goto('/login/out');
							}
						});
					}}
				>
					<svelte:fragment slot="lead">
						<Fa icon={faRightFromBracket} size="lg" />
					</svelte:fragment>
				</AppRailAnchor>
			{:else}
				<AppRailAnchor href="/login/in" title="GitHub">
					<svelte:fragment slot="lead">
						<Fa icon={faGithub} size="lg" />
					</svelte:fragment>
				</AppRailAnchor>
			{/if}
		</svelte:fragment>
	</AppRail>
	<div class="grid place-content-center place-items-center">
		<slot />
	</div>
</div>
