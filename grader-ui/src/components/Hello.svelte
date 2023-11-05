<script>
    let item = "";

    const getHello = async () => {
        const response = await fetch("/api/");
        return await response.json();
    }

    // Load the todos list
    let helloPromise = getHello()

</script>

{#await helloPromise}
    <p>Loading todos</p>
{:then hello}
    <h1 class="bg-slate-100">{ hello }</h1>
{/await}