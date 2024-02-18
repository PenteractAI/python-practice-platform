<script>
    import { score } from '../../stores/score.js';


</script>

<!--<div class="bg-bright-green-500 text-white font-bold rounded-full px-4 py-2"-->
<!--     title="Your current score"-->
<!--&gt;-->
<!--    Score: <span data-testid="score">{$score}</span>-->
<!--</div>-->

<div class="mx-auto flex items-center justify-center">
    <div class="w-full rounded-full bg-gradient-to-r from-malachite-500 to-bright-green-400 p-1">
        <div class="flex h-full w-full items-center justify-center bg-black back rounded-full px-4">
            <p class="font-rubik text-white">Score: <span data-testid="score">{$score}</span></p>
        </div>
    </div>
</div>