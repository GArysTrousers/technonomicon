<script lang="ts">
	import { api } from '$lib/api';
	import type { UserDevice, UserDeviceNote } from '$lib/schema';
	import { faPaperclip, faWrench } from '@fortawesome/free-solid-svg-icons';
	import dayjs from 'dayjs';
	import {
		Button,
		Heading,
		Input,
		Modal,
		Select,
		Spinner,
		Textarea,
		Timeline,
		TimelineItem
	} from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import UserDeviceNoteEditor from './UserDeviceNoteEditor.svelte';
	import type { GetTimelineRes } from '../../routes/api/user_device/timeline/+server';
	import { UserDeviceNoteType } from '$lib/types';

	export let userDeviceId: number | null = null;

	export let onSubmit: () => void;

	let userDevice: UserDevice | null = null;
	let userDeviceTimeline: UserDeviceNote[] | null = null;
	let started = dayjs().format('YYYY-MM-DDTHH:mm');
	let modalNoteEditor = {
		open: false,
		noteId: null
	};

	$: {
		getUserDevice(userDeviceId);
		getUserDeviceTimeline(userDeviceId);
	}

	async function getUserDevice(id: number | null) {
		if (id === null) {
			userDevice = null;
		} else {
			userDevice = await api.get('/api/user_device', { id });
			if (userDevice !== null) {
				started = dayjs(userDevice.started).format('YYYY-MM-DDTHH:mm');
			}
		}
	}
	async function getUserDeviceTimeline(id: number | null) {
		if (id === null) {
			userDeviceTimeline = null;
		} else {
			userDeviceTimeline = await api.get<GetTimelineRes>('/api/user_device/timeline', { id });
		}
	}

	async function saveUserDevice() {
		if (userDevice) {
			await api.patch('/api/user_device/', {
				user_device_id: userDevice.user_device_id,
				set: {
					assign_type: userDevice.assign_type,
					started: userDevice.started,
					notes: userDevice.notes
				}
			});
		}
	}
</script>

<div class="flex-col gap-3">
	{#if userDevice === null}
		<Spinner></Spinner>
	{:else}
		<Heading tag="h3">{userDevice.user_id} - {userDevice.device_id}</Heading>
		<div class="grid grid-cols-2 gap-3">
			<div class="flex-col gap-2">
				<div>Assignment Type</div>
				<Select
					bind:value={userDevice.assign_type}
					items={[
						{ value: 1, name: 'Loan' },
						{ value: 2, name: 'BYOD' },
						{ value: 3, name: 'SSR' }
					]}
				></Select>
				<div>Assigned on:</div>
				<Input type="datetime-local" value={started} />
				<Textarea bind:value={userDevice.notes} placeholder="Notes..." rows={3} />
				<Button class="" on:click={saveUserDevice}>Save</Button>
			</div>
			<div>
				<div class="flex-row">
					<Heading tag="h4">History</Heading>
					<Button
						on:click={() => {
							modalNoteEditor.noteId = null;
							modalNoteEditor.open = true;
						}}>Add</Button
					>
				</div>
				<Timeline>
					{#if userDeviceTimeline !== null}
						{#each userDeviceTimeline as item}
							<TimelineItem date={dayjs().format('DD MMM YYYY')}>
								<div class="flex-row items-center gap-2">
									{#if item.note_type === UserDeviceNoteType.Repair}
										<div class="font-bold text-orange-400" title="Repair"><Fa icon={faWrench} /></div>
									{/if}
									<div>{item.text}</div>
									<!-- <Fa icon={faPaperclip} /> -->
								</div>
							</TimelineItem>
						{:else}
							None
						{/each}
					{:else}
						<Spinner />
					{/if}
				</Timeline>
			</div>
		</div>
	{/if}
</div>

<Modal title="Add Note" bind:open={modalNoteEditor.open} size="sm">
	<UserDeviceNoteEditor
		bind:noteId={modalNoteEditor.noteId}
		{userDeviceId}
		onSubmit={() => {
			modalNoteEditor.open = false;
			getUserDeviceTimeline(userDeviceId);
		}}
	></UserDeviceNoteEditor>
</Modal>

<style>
</style>
