<script>
    import Assignment from "../components/Assignment.svelte";
    import { currentAssignment } from "../stores/currentAssignment.js";
</script>

<div class="flex h-screen w-full">
    {#await $currentAssignment}
        <p>Loading..</p>
    {:then assignment}
        {#if assignment}
            <Assignment/>
        {:else}
            <p class="text-3xl font-semibold flex-grow text-gray-300">No assignment available...</p>
        {/if}
    {/await}
</div>