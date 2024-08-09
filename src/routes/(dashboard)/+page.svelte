<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Button, Card, Heading } from 'flowbite-svelte';
	import { TableBodyRow } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-3 gap-5">
	<Card size="none">
		<Heading tag="h4">Users</Heading>
		<div>
			With Devices: {data.usersWithDevices}/{data.users} ({(
				(data.usersWithDevices / data.users) *
				100
			).toFixed(2)}%)
		</div>
		<div class="h-5 overflow-hidden rounded-full bg-gray-400">
			<div
				class="relative left-0 top-0 h-5 bg-green-500"
				style="width: {(data.usersWithDevices / data.users) * 100}%;"
			></div>
		</div>
	</Card>

	<Card size="none">
		<Heading tag="h4">Devices</Heading>
		<div>Without Users: {data.devicesWithoutUsers}/{data.devices}</div>
		<div class="h-5 overflow-hidden rounded-full bg-gray-400">
			<div
				class="relative left-0 top-0 h-5 bg-blue-500"
				style="width: {(data.devicesWithoutUsers / data.devices) * 100}%;"
			></div>
		</div>
	</Card>
</div>
