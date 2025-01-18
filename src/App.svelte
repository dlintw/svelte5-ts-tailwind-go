<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { store } from './lib/store.svelte'
  import FriendAdder from "./lib/FriendAdder.svelte";
  import FriendList from "./lib/FriendList.svelte";
</script>

<main class="min-h-screen">
  <div class="flex items-center gap-4">
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="h-[6em] p-[1.5em] will-change-filter transition-filter duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite Logo" />
    </a>
    <h1 class="text-3xl sm:text-4xl md:text-5xl">Vite + Svelte + Tailwind + Go</h1>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="h-24 p-6 will-change-filter transition-filter duration-300 hover:drop-shadow-[0_0_2em_#ff3e00aa]" alt="Svelte Logo" />
    </a>
  </div>

  Hello
  <input bind:value={store.name} type="text" aria-label="name for welcome" class="bg-gray-200"
      style="width: {store.name.length * 8 + 10}px; transition: width 0.2s;"
  >

  <div class="card">
    <Counter />
  </div>

  <p class="text-gray-300 bg-black">
    Click on the Vite and Svelte logos to learn more
  </p>
  <FriendAdder />
  <br/>
  <FriendList />
</main>

<style>
</style>
