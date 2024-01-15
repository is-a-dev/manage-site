<script>
	export let style = '';
	export let className = '';
	export let href = '';
</script>

<a
	class="btn btn-{style} btn-lg btn-block gap-2 bg-[#1e1e1e] shadow-sm transition-all ease-linear duration-300 {className}"
	{href}
>
	<slot />
</a>
