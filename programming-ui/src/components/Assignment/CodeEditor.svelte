<script>
    export let code;

</script>

<textarea
        bind:value={code}
        class="font-ubuntu flex-grow py-6 px-10 bg-white border-black text-sm focus:ring-1 focus:ring-offset-0 focus:ring-bright-green-400 text-black placeholder-gray-400 focus:outline-none w-full h-full"
        placeholder="Write your code here..."
        data-testid="code-editor"
></textarea>
