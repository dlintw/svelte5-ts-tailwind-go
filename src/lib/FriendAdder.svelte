<script lang="ts">
  import { db } from "./db.svelte";
  import { getRandomNames } from "./random";

  // Reactive state using $state
  let status: string = $state('');
  let friendName: string = $state("My best friend");
  let friendAge: number = $state(22);

  // Function to add a friend
  async function addFriend(): Promise<void> {
    if (!friendName.trim()) return; // Prevent adding empty names

    await db.friends.add({
      name: friendName,
      age: friendAge
    });

    friendName = ""; // Reset the input field
  }

  // Function to clear all friends
  async function clearItems(): Promise<void> {
    await db.friends.clear();
  }

  // Function to generate random friends
  async function generateRandomFriends(): Promise<void> {
    status = "Fetching random names from https://randommer.io/ ...";
    try {
      const names: string[] = await getRandomNames(1000);
      status = "Adding friends to the database...";

      await db.friends.bulkAdd(
        names.map(name => ({
          name,
          age: Math.floor(Math.random() * 100) // Ensures age is an integer
        }))
      );

      status = "Done!";
    } catch (error) {
      console.error(error);
      alert(
        "Sorry, could not fetch from https://randommer.io/. API limits may have been hit. Please add friends manually to showcase this sample."
      );
    } finally {
      status = '';
    }
  }
</script>

<div>
  <fieldset>
    <legend>Add new friend</legend>
    <label>
      Name:
      <input
        type="text"
        bind:value={friendName} />
    </label><br />
    <label>
      Age:
      <input
        type="number"
        bind:value={friendAge} />
    </label>
    <br />
    <button onclick={addFriend}>Add Friend</button>
  </fieldset>
  <div style="height:20px;">{status || ""}</div>
  <button onclick={generateRandomFriends}>Generate 1000 friends</button>
  <button onclick={clearItems}>Clear all data</button>
</div>