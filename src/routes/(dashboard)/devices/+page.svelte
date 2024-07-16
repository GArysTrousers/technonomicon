<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { TableBodyRow } from 'flowbite-svelte';
	import type { GetDeviceRes } from '../../api/device/+server';

  let devices:GetDeviceRes = [];

	onMount(async () => {
		devices = await api.get('/api/device');
	});
</script>

<div class="flex-col gap-3">
	<div class="flex-row justify-between items-center p-2 bg-gray-800 rounded-xl">
		<div class="flex-row">
      <Heading tag="h3" class="px-2">Devices</Heading>
    </div>
		<div class="flex-row">

		</div>
	</div>
  <Table shadow>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Groups</TableHeadCell>
    </TableHead>
    <TableBody>
      {#if devices.length > 0}
        {#each devices.slice(0, 15) as m}
          <TableBodyRow>
            <TableBodyCell>{m.device_id}</TableBodyCell>
            <TableBodyCell>{m.model_name}</TableBodyCell>
          </TableBodyRow>
        {/each}
      {/if}
    </TableBody>
  </Table>
</div>
