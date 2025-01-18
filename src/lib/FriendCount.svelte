<script lang="ts">
  import { liveQuery } from "dexie";
  import { db } from "./db";

  // Use $state for reactive state with TypeScript types
  let numFriends = $state<number | null>(null);

  // Use liveQuery to reactively update numFriends
  liveQuery(() => db.friends.count()).subscribe((count: number) => {
    numFriends = count;
  });
</script>

{#if numFriends == null}
  loading...
{:else}
  {numFriends}
{/if}