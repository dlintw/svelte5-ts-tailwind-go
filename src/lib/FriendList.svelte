<script>
    import { liveQuery } from "dexie";
    import { db } from "./db.svelte";
    import FriendCount from "./FriendCount.svelte";
    import {settings, saveSettings} from "./db.svelte";

    let pageSize = 20;

    $effect(() => {
      settings.offset = 0;
    });
    
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
    <form onsubmit={saveSettings} class="border flex flex-wrap items-center space-x-4 mx-2 my-2">
      <label class="flex items-center mx-2">
        Beginning of name:
        <input type="text" bind:value={settings.namePattern} class="w-full"/>
      </label>
      <label class="flex items-center">
        Min Age:
        <input type="number" bind:value={settings.minAge} class="w-16"/>
      </label>
      <label class="flex items-center">
        Max Age:
        <input type="number" bind:value={settings.maxAge} class="w-16"/>
      </label>
      <label class="flex items-center">
        Order By:
        <select bind:value={settings.orderBy}>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
      </label>
      <label class="flex items-center">
        Offset:
        <input type="number" bind:value={settings.offset} class="w-20"/>
      </label>
      <button type="submit">Save Query Settings</button>
    </form>

  <p>Result: Total number of friends in database: <FriendCount /></p>
  {#if $friends}
    <ul class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">        
      {#each $friends as friend (friend.id)}
        <li class="flex flex-col items-start">
          {friend.name}, {friend.age}
        </li>
      {/each}
    </ul>
  {/if}


  <!-- Pagination -->
  <p>Page {Math.round((settings.offset / pageSize) + 1)}</p>
  <button onclick={()=>settings.offset = 0}
    class={settings.offset === 0 ? 'hidden' : ''}>
    &lt;&lt; First page
  </button>
  <button onclick={()=>settings.offset -= pageSize}
    class={settings.offset === 0 ? 'hidden' : ''}>
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