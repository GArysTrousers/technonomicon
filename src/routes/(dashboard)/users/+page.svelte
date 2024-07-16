<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import {
		Button,
		Heading,
		Modal,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { TableBodyRow } from 'flowbite-svelte';
	import { faFilter } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import UserDetails from '$lib/comp/UserDetails.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { GetUserAllRes } from '../../api/user/+server';

	let users: GetUserAllRes = [];
	let searchedUsers: GetUserAllRes = [];
	let search = '';
	let modalUserDetails = {
		open: false,
		userId: ''
	};
	let viewMax = 15;

	$: {
		let searchLow = search.toLowerCase();
		searchedUsers =
			search === ''
				? users.slice(0, viewMax)
				: users
						.filter((v) => {
							return v.user_id.toLowerCase().includes(searchLow)
              || v.dn.toLowerCase().includes(searchLow)
              || v.groups.toLowerCase().includes(searchLow);
						})
						.slice(0, viewMax);
	}

	onMount(async () => {
		users = await api.get('/api/user');
		const onLoadViewUser = $page.url.searchParams.get('');
		if (onLoadViewUser) {
			viewStudentDetails(onLoadViewUser);
		}
	});

	async function viewStudentDetails(id: string) {
		modalUserDetails.userId = id;
		modalUserDetails.open = true;
		$page.url.searchParams.set('', modalUserDetails.userId);
		goto($page.url);
	}
</script>

<div class="flex-col gap-3">
	<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
		<div class="flex-row">
			<Heading tag="h3" class="px-2">Users</Heading>
		</div>
		<div class="flex-row"></div>
	</div>
	<div class="flex-row items-center justify-between gap-3">
		<Search bind:value={search}></Search>
		<Button class="!p-3" on:click={() => {}}><Fa icon={faFilter} size="lg" /></Button>
	</div>
	<Table shadow hoverale={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>ID</TableHeadCell>
			<TableHeadCell>Groups</TableHeadCell>
		</TableHead>
		<TableBody>
			{#if users.length > 0}
				{#each searchedUsers as u}
					<TableBodyRow on:click={() => viewStudentDetails(u.user_id)}>
						<TableBodyCell>{u.dn}</TableBodyCell>
						<TableBodyCell>{u.user_id}</TableBodyCell>
						<TableBodyCell>{u.groups}</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>

<Modal
	bind:open={modalUserDetails.open}
	outsideclose={true}
	on:close={() => {
		$page.url.searchParams.delete('');
		goto($page.url);
	}}
>
	<UserDetails bind:userId={modalUserDetails.userId}></UserDetails>
</Modal>
