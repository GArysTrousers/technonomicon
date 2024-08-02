<script lang="ts">
	import { api } from '$lib/api';
	import { UserDeviceNoteType, UserNoteType } from '$lib/types';
	import dayjs from 'dayjs';
	import { Button, Input, Select, Textarea } from 'flowbite-svelte';

	export let noteId: number | null;
	export let userDeviceId: number | null;
	export let onSubmit: () => void = () => {};
	let note: {
		note_id: number;
		user_device_id: number;
		date: string;
		text: string;
		note_type: number;
	};
	const noteTypes = [
		{ name: 'General', value: UserDeviceNoteType.General },
		{ name: 'Repair', value: UserDeviceNoteType.Repair }
	];

	$: {
		getUserDeviceNote(noteId);
    
	}

	async function getUserDeviceNote(id: number | null) {
		if (id === null) {
			note = newNote();
		} else {
			note = await api.get('/api/user_device_note', { id });
		}
	}

	function newNote() {
		return {
			note_id: 0,
			user_device_id: userDeviceId || 0,
			note_type: 0,
			text: '',
			date: dayjs().format('YYYY-MM-DDTHH:mm')
		};
	}

	async function save() {
    
		let data = {
			...note,
			date: dayjs(note.date).toISOString()
		};
		if (note.note_id === 0) {
			await api.put('/api/user_device_note/', data);
		} else {
			await api.patch('/api/user_device_note/', data);
		}
		return true;
	}
</script>

<div class="flex-col gap-3">
	<Select items={noteTypes} bind:value={note.note_type} />
	<Input type="datetime-local" bind:value={note.date} />
	<Textarea rows={5} bind:value={note.text} placeholder="Notes..." />
	<Button
		on:click={async () => {
			if (await save()) {
				onSubmit();
			}
		}}>Save</Button
	>
</div>

<style>
</style>
