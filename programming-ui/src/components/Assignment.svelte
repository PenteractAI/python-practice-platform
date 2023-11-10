<script>
    import CodeEditor from "./CodeEditor.svelte";

    export let assignment;
</script>

<section>
    <h2 class="text-xl">{ assignment.title }</h2>
    <h3>{ assignment.assignment_order }</h3>
    <p>{ assignment.handout }</p>
    <CodeEditor />
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4">Submit</button>
</section>