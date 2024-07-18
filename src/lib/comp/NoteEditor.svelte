<script lang="ts">
	import { NoteType } from '$lib/types';
	import { Button, Input, Select, Textarea } from 'flowbite-svelte';

	export let note: {
    date: string;
    note_id: number;
    user_id: string;
    text: string;
    note_type: number;
};
	export let onSubmit: () => void;

  // export let userId: string;


  // function newNote() {
	// 	note = {
	// 		note_id: 0,
	// 		user_id: userId,
	// 		note_type: 0,
	// 		text: '',
	// 		date: '0'
	// 	};
	// 	modalNoteEditor.target = user?.dn || 'Student';
	// 	modalNoteEditor.open = true;
	// }
</script>

<div class="flex-col gap-3">
	<Select items={[{ name: 'General', value: NoteType.General }]} bind:value={note.note_type} />
  <Input type="datetime-local" bind:value={note.date}/>
	<Textarea rows={5} bind:value={note.text} placeholder="Notes..."/>
	<Button on:click={onSubmit}>Save</Button>
</div>

<style>
</style>
