<script>
  import { userUuid } from "../stores/stores.js";
  import Score from "../components/Header/Score.svelte";
</script>

<nav class="top-0 z-50 w-full bg-black">
  <div class="px-10 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start rtl:justify-end">
        <h1 class="self-center text-xl font-rubik sm:text-2xl whitespace-nowrap text-white">Course Project I</h1>
      </div>
      <div class="flex items-center">
        <div class="flex items-center ms-3">
          <Score />
        </div>
      </div>
    </div>
  </div>
</nav>