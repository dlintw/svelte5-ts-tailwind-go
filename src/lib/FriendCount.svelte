<script>
    import { liveQuery } from "dexie";
    import { db } from "./db";

    let numFriends = liveQuery(() => db.friends.count());
  </script>

  {$numFriends == null ? "loading..." : $numFriends}
