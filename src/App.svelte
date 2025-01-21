<script lang="ts">
  import Title from "./lib/Title.svelte";
  import FriendAdder from "./lib/FriendAdder.svelte";
  import FriendList from "./lib/FriendList.svelte";
  import { loadSettings } from "./lib/db.svelte";

  $effect(() => {
    loadSettings();
  });
</script>

<Title />
<FriendAdder />
<FriendList />
<style></style>
