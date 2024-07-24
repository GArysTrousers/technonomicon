<script lang="ts">
	import { AssignStatus } from "$lib/types";
	import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
	import dayjs from "dayjs";
	import Fa from "svelte-fa";


  export let status: AssignStatus;
  export let date: string | null;
  export let onClick: () => void;
</script>

<button
	class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
	on:click={onClick}
>
	{#if status === AssignStatus.Assigned}
		<Fa icon={faDotCircle} class="text-green-500" />
		<div class="text-sm italic">In possession</div>
	{:else if status === AssignStatus.Returned}
		<Fa icon={faDotCircle} class="text-purple-500" />
		<div class="text-sm italic">
			Returned - {dayjs(date).format('DD MMM YYYY')}
		</div>
	{:else if status === AssignStatus.Lost}
		<Fa icon={faDotCircle} class="text-red-500" />
		<div class="text-sm italic">
			Lost - {dayjs(date).format('DD MMM YYYY')}
		</div>
	{:else}
		<Fa icon={faDotCircle} class="text-gray-500" />
		<div class="text-sm italic">
			Unknown - {dayjs(date).format('DD MMM YYYY')}
		</div>
	{/if}
</button>

<style>
</style>
