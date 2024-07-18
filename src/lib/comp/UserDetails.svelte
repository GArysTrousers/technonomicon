<script lang="ts">
	import { api } from '$lib/api';
	import { AssignStatus } from '$lib/types';
	import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
	import dayjs from 'dayjs';
	import { Avatar, Button, Heading, Modal, Spinner, Timeline, TimelineItem } from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import DeviceAssigner from './DeviceAssigner.svelte';
	import NoteEditor from './NoteEditor.svelte';
	import type { GetTimelineRes } from '../../routes/api/user/timeline/+server';
	import type { GetUserOneRes } from '../../routes/api/user/+server';

	export let userId = '';
	let user: GetUserOneRes | null = null;
	let timeline: GetTimelineRes | null = null;
	const modalAssignDevice = {
		open: false
	};

	const modalStatusSelector = {
		open: false,
		userDeviceId: 0
	};

	const modalNoteEditor = {
		open: false,
		target: '',
		note: {
			note_id: 0,
			user_id: '',
			note_type: 0,
			text: '',
			date: dayjs().format('YYYY-MM-DDTHH:mm'),
		}
	};

	$: {
		getUserDetails(userId);
	}

	async function getUserDetails(id: string) {
		if (id !== '') {
			user = await api.get('/api/user', { id });
			timeline = await api.get('/api/user/timeline', { id });
		} else {
			user = null;
		}
	}

	async function setAssignStatus(assignId: number, status: AssignStatus) {
		try {
			await api.patch('/api/user_device/set_status', {
				id: assignId,
				status: status
			});
			getUserDetails(userId);
			modalStatusSelector.open = false;
		} catch (error) {}
	}

	function openStatusSelector(id: number) {
		modalStatusSelector.userDeviceId = id;
		modalStatusSelector.open = true;
	}

	function newNote() {
		modalNoteEditor.note = {
			note_id: 0,
			user_id: userId,
			note_type: 0,
			text: '',
			date: dayjs().format('YYYY-MM-DDTHH:mm'),
		};
		modalNoteEditor.target = user?.dn || 'Student';
		modalNoteEditor.open = true;
	}

	async function saveNote() {
		try {
			let res = await api.put('/api/user_note', {
        ...modalNoteEditor.note,
        date: dayjs(modalNoteEditor.note.date)
      });
			modalNoteEditor.open = false;
			getUserDetails(userId);
		} catch (e) {}
	}
</script>

<div>
	{#if user === null || timeline === null}
		<div class="flex-row justify-center">
			<Spinner></Spinner>
		</div>
	{:else}
		<div class="flex-col gap-3">
			<div class="flex-row gap-3">
				<Avatar size="xl" class="object-cover" src="/content/portrait/{user.user_id}.jpg" alt="portrait" />
				<div class="flex-col">
					<Heading tag="h3">{user.dn}</Heading>
					<div class="">{user.user_id}</div>
					<div class="text-sm italic">{user.groups}</div>
				</div>
			</div>
			<div class="flex-row gap-2">
				<Button on:click={() => (modalAssignDevice.open = true)}>Assign Device</Button>
				<Button on:click={newNote}>Add Note</Button>
			</div>
			<div class="flex-col">
				<Heading tag="h4">History</Heading>
				<Timeline>
					{#each timeline as i}
						<TimelineItem date={dayjs(i.date).format('DD MMM YYYY')}>
							{#if i.type === 'device'}
								<div class="flex-row rounded-lg bg-gray-800 hover:brightness-110">
									<div class="w-full flex-col px-2">
										<button
											class="mr-auto text-left text-lg font-bold text-white hover:underline"
											on:click={() => {
												console.log('edit');
											}}
										>
											{i.device_id}
										</button>
										<div class="flex-col">
											<button
												class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
												on:click={() => openStatusSelector(i.user_device_id)}
											>
												{#if i.status === AssignStatus.Assigned}
													<Fa icon={faDotCircle} class="text-green-500" />
													<div class="text-sm italic">In possession</div>
												{:else if i.status === AssignStatus.Returned}
													<Fa icon={faDotCircle} class="text-purple-500" />
													<div class="text-sm italic">
														Returned - {dayjs(i.ended).format('DD MMM YYYY')}
													</div>
												{:else if i.status === AssignStatus.Lost}
													<Fa icon={faDotCircle} class="text-red-500" />
													<div class="text-sm italic">
														Lost - {dayjs(i.ended).format('DD MMM YYYY')}
													</div>
												{:else}
													<Fa icon={faDotCircle} class="text-gray-500" />
													<div class="text-sm italic">
														Unknown - {dayjs(i.ended).format('DD MMM YYYY')}
													</div>
												{/if}
											</button>
											<div class="px-2 italic">{i.notes}</div>
										</div>
									</div>
									<div class="flex-col justify-center p-2"></div>
								</div>
							{:else if i.type === 'note'}
								<div class="flex-row rounded-lg bg-gray-800 hover:brightness-110">
                  <div class="w-full flex-col px-2">
                    {i.text}
                  </div>
                </div>
							{/if}
						</TimelineItem>
					{:else}
						<TimelineItem>None</TimelineItem>
					{/each}
				</Timeline>
			</div>
		</div>
	{/if}
</div>

<Modal title="Assign Device" size="md" bind:open={modalAssignDevice.open}>
	<DeviceAssigner
		bind:userId
		onSubmit={() => {
			modalAssignDevice.open = false;
			getUserDetails(userId);
		}}
	/>
</Modal>

<Modal title="Add Note - {modalNoteEditor.target}" size="sm" bind:open={modalNoteEditor.open}>
	<NoteEditor bind:note={modalNoteEditor.note} onSubmit={saveNote} />
</Modal>

<Modal title="Select Status" size="xs" bind:open={modalStatusSelector.open}>
	<div class="flex-col gap-1">
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => setAssignStatus(modalStatusSelector.userDeviceId, AssignStatus.Assigned)}
		>
			<Fa icon={faDotCircle} class="text-green-500" />
			<div class="italic">In possession</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => setAssignStatus(modalStatusSelector.userDeviceId, AssignStatus.Returned)}
		>
			<Fa icon={faDotCircle} class="text-purple-500" />
			<div class="italic">Returned</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => setAssignStatus(modalStatusSelector.userDeviceId, AssignStatus.Lost)}
		>
			<Fa icon={faDotCircle} class="text-red-500" />
			<div class="italic">Lost</div>
		</button>
		<button
			class="mr-auto flex-row items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-700"
			on:click={() => setAssignStatus(modalStatusSelector.userDeviceId, AssignStatus.Unknown)}
		>
			<Fa icon={faDotCircle} class="text-gray-500" />
			<div class="italic">Unknown</div>
		</button>
	</div>
</Modal>

<style>
	:global(ol > li) {
		margin-bottom: 1rem !important;
	}
</style>
