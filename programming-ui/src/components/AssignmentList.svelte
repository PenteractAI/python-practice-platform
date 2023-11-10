<script>
    import Assignment from "./Assignment.svelte";
    import GradingButton from "./GradingButton.svelte";
    let item = "";

    const getAssignments = async () => {
        try {
            const response = await fetch("/api/assignments"); // ERROR
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de l'appel API:", error);
        }
    }

    let assignmentsPromise = getAssignments();
</script>

{#await assignmentsPromise}
    <p>Loading assignments</p>
{:then assignments}
    {#if assignments.length == 0}
        <p>No assignment available</p>
    {:else}
        <ul>
            {#each assignments as assignment}
                <Assignment assignment={assignment}/>
            {/each}
        </ul>
    {/if}
{/await}