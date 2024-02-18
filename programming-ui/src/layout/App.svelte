<script>
    import Header from "./Header.svelte";
    import Workspace from "./Workspace.svelte";
    import {onMount} from "svelte";
    import {userUuid} from "../stores/stores.js";
    import {score} from "../stores/score.js";
    import {currentAssignment} from "../stores/currentAssignment.js";

    onMount(() => {
        score.loadScore($userUuid);
        currentAssignment.loadCurrentAssignment($userUuid);
    })

    // Ensure the re-rendering of the Workspace component when the current assignment changes
    $: key = $currentAssignment?.id;
</script>

<Header />
{#key key}
    <Workspace />
{/key}