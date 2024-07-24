<script lang="ts">
	import { AssignStatus } from "$lib/types";
	import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
	import { Modal } from "flowbite-svelte";
	import Fa from "svelte-fa";

  export let open = false;
  export let id: string | number;
  export let onSelect: (id: any, status: AssignStatus) => Promise<void>;

</script>

<Modal title="Select Status" size="xs" bind:open={open}>
	<div class="flex-col gap-1">
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => onSelect(id, AssignStatus.Assigned)}
		>
			<Fa icon={faDotCircle} class="text-green-500" />
			<div class="italic">In possession</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => onSelect(id, AssignStatus.Returned)}
		>
			<Fa icon={faDotCircle} class="text-purple-500" />
			<div class="italic">Returned</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => onSelect(id, AssignStatus.Lost)}
		>
			<Fa icon={faDotCircle} class="text-red-500" />
			<div class="italic">Lost</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => onSelect(id, AssignStatus.Unknown)}
		>
			<Fa icon={faDotCircle} class="text-gray-500" />
			<div class="italic">Unknown</div>
		</button>
	</div>
</Modal>

<style>
</style>
