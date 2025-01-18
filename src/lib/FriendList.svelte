<script lang="ts">
  import { liveQuery } from "dexie";
  import { db } from "./db";
  import FriendCount from "./FriendCount.svelte";
  import type { Friend } from "./db";

  // Query parameters:
  let namePattern = $state<string>("");
  let minAge = $state<number>(18);
  let maxAge = $state<number>(65);
  let orderBy = $state<"name" | "age">("name");

  // Pagination:
  let offset = $state<number>(0);
  const pageSize = 25;

  // Reset offset when query parameters change
  $effect(() => {
    // namePattern;
    // minAge;
    // maxAge;
    // orderBy;
    offset = 0;
  });

  // Query
  let friends = $state<Array<Friend> | null>(null);

  $effect(() => {
    const subscription = liveQuery(async () => {
      const lowerNamePattern = namePattern.toLowerCase();
      const collection =
        orderBy === "age"
          ? db.friends
              .where("age")
              .between(minAge || 0, maxAge || Infinity, true, true)
              .filter((friend) =>
                friend.name.toLowerCase().startsWith(lowerNamePattern)
              )
          : db.friends
              .where("name")
              .startsWithIgnoreCase(namePattern)
              .filter((friend) => friend.age >= minAge && friend.age <= maxAge);

      return await collection.offset(offset).limit(pageSize).toArray();
    }).subscribe((result) => {
      friends = result;
    });

    return () => subscription.unsubscribe();
  });
</script>

<div>
  <fieldset>
    <legend>Query friends:</legend>
    <label>
      Beginning of name:
      <input type="text" bind:value={namePattern} />
    </label>
    <label>
      Minimum age:
      <input type="number" bind:value={minAge} />
    </label>
    <label>
      Maximum age:
      <input type="number" bind:value={maxAge} />
    </label>
    <label>
      Order by:
      <input type="radio" value="name" bind:group={orderBy} /> Name
      <input type="radio" value="age" bind:group={orderBy} /> Age
    </label>
  </fieldset>

  <div>Result</div>

  <p>Total number of friends in database: <FriendCount /></p>

  {#if friends}
    <ul>
      {#each friends as friend (friend.id)}
        <li>{friend.name}, {friend.age}</li>
      {/each}
    </ul>
  {/if}

  <!-- Pagination -->
  <p>Page {Math.round(offset / pageSize + 1)}</p>
  <button onclick={() => (offset = 0)} disabled={offset === 0}>
    &lt;&lt; First page
  </button>
  <button onclick={() => (offset -= pageSize)} disabled={offset === 0}>
    &lt; Previous page
  </button>
  {#if friends?.length === pageSize}
    <button onclick={() => (offset += pageSize)}>Next page &gt;</button>
  {/if}

  <style>
    input:not([type="radio"]) {
      display: block;
    }
  </style>
</div>