<script>
    import { liveQuery } from "dexie";
    import { db } from "./db";
    import FriendCount from "./FriendCount.svelte";

    // Query parameters:
    let namePattern = "";
    let minAge = 18;
    let maxAge = 65;
    let orderBy = "name";

    // Pagination:
    let offset = 0;
    let pageSize = 25;

    // (This part is optional):
    // Let's just reset offset when params change...
    // (so user don't stay on page 10 with empty results
    //  while narrowing query)
    $: {
      // List every query parameter:
      namePattern;
      minAge;
      maxAge;
      orderBy;
      // Reset offset when they change:
      offset = 0;
    }

    //
    // Query
    //
    $: friends = liveQuery(async () => {
      const lowerNamePattern = namePattern.toLowerCase();
      const collection =
        orderBy === "age"
          ? db.friends
              // Let "age" index filter age criteria and sort
              .where("age")
              .between(minAge || 0, maxAge || Infinity, true, true)
              // filter name criteria "manually":
              .filter(friend =>
                friend.name.toLowerCase().startsWith(lowerNamePattern)
              )
          : db.friends
              // Let "name" index filter name and sort
              .where("name")
              .startsWithIgnoreCase(namePattern)
              // Filter age criteria "manually":
              .filter(friend => friend.age >= minAge && friend.age <= maxAge);

      // Return a paged result:
      return await collection
        .offset(offset)
        .limit(pageSize)
        .toArray();
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
  <button on:click={()=>offset = 0}
    disabled={offset === 0}>
    &lt;&lt; First page
  </button>
  <button on:click={()=>offset -= pageSize}
    disabled={offset === 0}>
    &lt; Previous page
  </button>
  {#if ($friends?.length === pageSize)}
  <button on:click={()=>offset += pageSize}>
    Next page >
  </button>
  {/if}

  <style>
    input:not([type="radio"]) {
      display: block;
    }
  </style>
  </div>