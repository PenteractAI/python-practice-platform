<script>
    export let handout;
</script>

<div class="relative w-full font-ubuntu">
    <div class="absolute -right-1 -bottom-1 bg-black h-full w-full"></div>
    <div class="relative bg-white border-black border-2 text-black p-8 max-h-40 overflow-y-auto">
        <p
                class="leading-5 font-bold text-lg text-justify"
                data-testid="assignment-handout"
        >{ handout }</p>
    </div>
</div>