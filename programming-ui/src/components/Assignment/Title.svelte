<script>
    import {currentAssignment} from "../../stores/currentAssignment.js";
    import Order from "./Order.svelte";

    export let title, assignmentOrder;
</script>

<div class="font-ubuntu text-right display-inline-block bg-black text-white uppercase leading-7 font-light px-4 py-1">
    <span data-testid="assignment-order">{assignmentOrder}.</span>
    <h2 class="inline" data-testid="assignment-title">{title}</h2>
</div>
