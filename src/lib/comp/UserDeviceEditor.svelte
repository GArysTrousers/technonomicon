<script lang="ts">
	import { api } from '$lib/api';
	import type { UserDevice } from '$lib/schema';
	import dayjs from 'dayjs';
	import { Button, Heading, Input, Select, Spinner, Textarea } from 'flowbite-svelte';

	export let userDeviceId: number | null = null;

	export let onSubmit: () => void;

	let userDevice: UserDevice | null = null;

	$: {
		getUserDevice(userDeviceId);
	}

	async function getUserDevice(id: number | null) {
		if (id === null) {
			userDevice = null;
		} else {
			userDevice = await api.get('/api/user_device', { id });
		}
	}
</script>

<div class="flex-col gap-3">
	{#if userDevice === null}
		<Spinner></Spinner>
	{:else}
		<Heading tag="h3">{userDevice.user_id} - {userDevice.device_id}</Heading>
    <div>{dayjs(userDevice.started).format('DD MMM YYYY')}</div>
    <Button class="" on:click={onSubmit}>Save</Button>
	{/if}
</div>

<style>
</style>
