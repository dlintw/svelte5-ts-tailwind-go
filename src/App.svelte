<script lang="ts">
  import Title from './lib/Title.svelte';
  import FriendAdder from "./lib/FriendAdder.svelte";
  import FriendList from "./lib/FriendList.svelte";
  import { loadSettings} from "./lib/db.svelte";

  $effect(() => {
    loadSettings();
  });
  
</script>

<main class="min-h-screen">
  <Title />
  <FriendAdder />
  <br/>
  <FriendList />
</main>

<style>
</style>
