<script>
    import { liveQuery } from "dexie";
    import { db } from "./db.svelte";
    import FriendCount from "./FriendCount.svelte";
    import {settings, saveSettings} from "./db.svelte";

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
      settings.offset = 0;
    });

    //
    // Query
    //
    let friends = $derived.by(() => {
      const lowerNamePattern = settings.namePattern.toLowerCase();
      const minAge2 = settings.minAge;
      const maxAge2 = settings.maxAge;
      const offset2 = settings.offset;

      if (settings.orderBy === "age") {
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
          .startsWithIgnoreCase(settings.namePattern)
          // Filter age criteria "manually":
          .filter(friend => friend.age >= minAge2 && friend.age <= maxAge2)
          .offset(offset2).limit(pageSize).toArray()
          );
      }
    });
  </script>
  <div>
    <form onsubmit={saveSettings}>
      <label>
        Beginning of name:
        <input type="text" bind:value={settings.namePattern} />
      </label>
      <label>
        Min Age:
        <input type="number" bind:value={settings.minAge} />
      </label>
      <label>
        Max Age:
        <input type="number" bind:value={settings.maxAge} />
      </label>
      <label>
        Order By:
        <select bind:value={settings.orderBy}>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
      </label>
      <label>
        Offset:
        <input type="number" bind:value={settings.offset} />
      </label>
      <button type="submit">Save Settings</button>
    </form>

  <p>Result: Total number of friends in database: <FriendCount /></p>
  {#if $friends}
    <ul>
      {#each $friends as friend (friend.id)}
        <li>{friend.name}, {friend.age}</li>
      {/each}
    </ul>
  {/if}


  <!-- Pagination -->
  <p>Page {Math.round((settings.offset / pageSize) + 1)}</p>
  <button onclick={()=>settings.offset = 0}
    disabled={settings.offset === 0}>
    &lt;&lt; First page
  </button>
  <button onclick={()=>settings.offset -= pageSize}
    disabled={settings.offset === 0}>
    &lt; Previous page
  </button>
  {#if ($friends?.length === pageSize)}
  <button onclick={()=>settings.offset += pageSize}>
    Next page >
  </button>
  {/if}

  <style>
    input:not([type="radio"]) {
      display: block;
    }
  </style>
  </div>