<script>
  export let isGrading;
  export let sendGradingRequest;

  const btnBackgroundClasses = "absolute -right-2 -bottom-2 h-full w-full";
  const btnInnerClasses = "flex justify-center items-center relative h-full w-full py-3 uppercase"
</script>

<div class="relative group w-full font-rubik">
{#if isGrading}
  <div class="{btnBackgroundClasses} bg-black"></div>
  <button
          class="{btnInnerClasses} text-black border-2 border-black bg-gradient-to-r from-cinnabar-500 via-starship-400 via-bright-green-400 to-blush-pink-400 background-animate"
          data-testid="grading-bar"
  >Grading...</button>
{:else}
  <div class="{btnBackgroundClasses} bg-gradient-to-tr from-cinnabar-500 to-cerise-red-400"></div>
  <button
          on:click={sendGradingRequest}
          class="{btnInnerClasses} text-white bg-black transition ease-in-out delay-100
          group-hover:-translate-y-1 group-hover:-translate-x-1"
          data-testid="grading-button"
  >
    <span class="mr-4">Submit</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
    </svg>
  </button>
{/if}
</div>


<style>

  .background-animate {
    background-size: 400%;

    -webkit-animation: LeftRightAnimation 3s ease infinite;
    -moz-animation: LeftRightAnimation 3s ease infinite;
    animation: LeftRightAnimation 3s ease infinite;
  }

  @keyframes LeftRightAnimation {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>