<script lang="ts">
	import { api } from '$lib/api';
	import { Button, Datepicker, Input, Radio, Search, Select, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { GetDeviceRes } from '../../routes/api/device/+server';
	import dayjs from 'dayjs';

	export let userId = '';
	export let onSubmit = () => {};

	let search = '';
	let assign_type = 1;
	let selectedMachine = '';
	let notes = '';
  let date = dayjs().format('YYYY-MM-DDTHH:mm');
	let devices: GetDeviceRes = [];

	onMount(async () => {
		devices = await api.get('/api/device');
	});

	$: searchedMachines =
		search === ''
			? devices.slice(0, 30)
			: devices
					.filter((v) => {
						return v.device_id.includes(search);
					})
					.slice(0, 30);

	async function assignDevice() {
		try {
			await api.put('/api/user_device', {
				user_id: userId,
				device_id: selectedMachine,
				assign_type: assign_type,
        started: dayjs(date),
				notes: notes
			});
			onSubmit();
		} catch (e) {}
	}
</script>

<div class="grid grid-cols-2 gap-3">
	<div class="flex-col gap-3">
		<Select
			bind:value={assign_type}
			items={[
				{ value: 1, name: 'Loan' },
				{ value: 2, name: 'BYOD' },
				{ value: 3, name: 'SSR' }
			]}
		></Select>
		<Textarea placeholder="Notes..." rows={4} bind:value={notes}></Textarea>
    <Input type="datetime-local" bind:value={date}/>
	</div>
	<div class="flex-col gap-3">
		<Search bind:value={search}></Search>
		<div class="h-64 flex-col overflow-y-auto pr-2">
			<ul
				class="w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
			>
				{#each searchedMachines as m}
					<li>
						<Radio class="p-3" bind:group={selectedMachine} value={m.device_id}>{m.device_id}</Radio>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<Button class="col-span-2" on:click={assignDevice}>Save</Button>
</div>

<style>
</style>
