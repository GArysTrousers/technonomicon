<script lang="ts">
	import { UserNoteType } from '$lib/types';
	import { Button, Input, Select, Textarea } from 'flowbite-svelte';

	export let note: {
		date: string;
		note_id: number;
		user_id: string;
		text: string;
		note_type: number;
	};
	export let onSubmit: () => void;
</script>

<div class="flex-col gap-3">
	<Select items={[{ name: 'General', value: UserNoteType.General }]} bind:value={note.note_type} />
	<Input type="datetime-local" bind:value={note.date} />
	<Textarea rows={5} bind:value={note.text} placeholder="Notes..." />
	<Button on:click={onSubmit}>Save</Button>
</div>

<style>
</style>
