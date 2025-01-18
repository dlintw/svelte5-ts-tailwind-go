<script>
    import { liveQuery } from "dexie";
    import { db } from "./db";
    import FriendCount from "./FriendCount.svelte";

    // Query parameters:
    let namePattern = $state("");
    let minAge = $state(18);
    let maxAge = $state(65);
    let orderBy = $state("name");

    // let {
    //   namePattern = "",
    //   minAge = 18,
    //   maxAge = 65,
    //   orderBy = "name"
    // } = $props()

    // Pagination:
    let offset = $state(0);
    let pageSize = 10;

    // (This part is optional):
    // Let's just reset offset when params change...
    // (so user don't stay on page 10 with empty results
    //  while narrowing query)
    $effect(() => {
      // List every query parameter:
      // namePattern;
      // minAge;
      // maxAge;
      // orderBy;
      // Reset offset when they change:
      offset = 0;
    });

    //
    // Query
    //
    let friends = $derived.by(() => {
      const lowerNamePattern = namePattern.toLowerCase();
      const minAge2 = minAge;
      const maxAge2 = maxAge;
      const offset2 = offset;

      if (orderBy === "age") {
        return liveQuery(() => db.friends
          .where("age")
          .between(minAge2 || 0, maxAge2 || Infinity, true, true)
          // filter name criteria "manually":
          .filter(friend =>
            friend.name.toLowerCase().startsWith(lowerNamePattern))
            .offset(offset2).limit(pageSize).toArray());
      } else {
        return liveQuery(() => db.friends
          .where("name")
          .startsWithIgnoreCase(namePattern)
          // Filter age criteria "manually":
          .filter(friend => friend.age >= minAge2 && friend.age <= maxAge2)
          .offset(offset2).limit(pageSize).toArray()
          );
      }
    });
  </script>
  <div>
  <fieldset>
    <legend>Query friends:</legend>
  <label>
    Beginning of name:
    <input
      type="text"
      bind:value={namePattern} />
  </label>
  <label>
    Minimum age:
    <input
      type="number"
      bind:value={minAge} />
  </label>
  <label>
    Maximum age:
    <input
      type="number"
      bind:value={maxAge} />
  </label>
  <label>
    Order by:
    <input
      type="radio"
      value="name"
      bind:group={orderBy} /> Name
    <input
      type="radio"
      value="age"
      bind:group={orderBy} /> Age
  </label>
  </fieldset>

  <h3>Result</h3>

  <p>Total number of friends in database: <FriendCount /></p>
  {#if $friends}
    <ul>
      {#each $friends as friend (friend.id)}
        <li>{friend.name}, {friend.age}</li>
      {/each}
    </ul>
  {/if}




  <!-- Pagination -->
  <p>Page {Math.round((offset / pageSize) + 1)}</p>
  <button onclick={()=>offset = 0}
    disabled={offset === 0}>
    &lt;&lt; First page
  </button>
  <button onclick={()=>offset -= pageSize}
    disabled={offset === 0}>
    &lt; Previous page
  </button>
  {#if ($friends?.length === pageSize)}
  <button onclick={()=>offset += pageSize}>
    Next page >
  </button>
  {/if}

  <style>
    input:not([type="radio"]) {
      display: block;
    }
  </style>
  </div>