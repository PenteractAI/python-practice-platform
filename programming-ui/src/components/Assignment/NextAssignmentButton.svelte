<script>
    import {currentAssignment} from "../../stores/currentAssignment.js";
    import {userUuid} from "../../stores/stores.js";
</script>

<div class="relative group w-full font-rubik">
    <div class="absolute -right-2 -bottom-2 h-full w-full bg-gradient-to-tr from-malachite-500 to-bright-green-400"></div>
    <button
            on:click={currentAssignment.loadCurrentAssignment($userUuid)}
            class="flex justify-center items-center relative h-full w-full py-3 uppercase text-white bg-black transition ease-in-out delay-100 group-hover:-translate-y-1 group-hover:-translate-x-1"
            data-testid="next-assignment-button"
    >
        <span class="mr-4">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>
