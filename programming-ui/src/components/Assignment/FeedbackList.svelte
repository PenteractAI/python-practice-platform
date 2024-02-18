<script>
    import { flip } from 'svelte/animate';
    export let submissions;

    const cleanFeedback = (graderFeedback) => {
        let cleanedFeedback = graderFeedback;

        cleanedFeedback = cleanedFeedback.replace(/^[^T]/, '');
        cleanedFeedback = cleanedFeedback.replace(/={6,}/g, '');
        cleanedFeedback = cleanedFeedback.replace(/-{6,}/g, '<br/><br/>');

        return cleanedFeedback;
    }
</script>

<div data-testid="feedback-list" class="font-ubuntu ease-in-out delay-100 transition flex-grow overflow-y-auto border-4 border-dashed border-black gap-5 {submissions.length == 0 ? 'opacity-20' : 'opacity-100'}">
    {#if submissions.length > 0}
        {#each submissions as submission (submission.id)}
            <div
                    animate:flip={{ duration: 300 }}
                    data-testid="feedback-alert"
                    class="p-4 text-wrap transition-opacity duration-300 block break-words text-sm border-b text-white rounded m-2 bg-gradient-to-tr shadow-md {submission.correct ? 'from-malachite-600 to-bright-green-500' : 'from-cinnabar-700 to-cerise-red-600'}"
            >{@html cleanFeedback(submission.graderFeedback)}</div>
        {/each}
    {:else}
        <div class="flex justify-center items-center h-full">
            <p class="text-center text-black font-medium">No submission yet</p>
        </div>
    {/if}
</div>

<!--class="p-4 text-wrap transition-opacity duration-300 block break-words text-sm border-b {submission.correct ? 'bg-bright-green-100 text-bright-green-700 border-bright-green-700' : 'bg-cinnabar-100 text-cinnabar-700 border-cinnabar-700'}"-->