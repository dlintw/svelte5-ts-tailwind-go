import Dexie from "dexie";
import type { Table } from "dexie";

// Define the database schema
export interface Friend {
  id?: number; // Auto-incremented primary key
  name: string;
  age: number;
}

class SvelteLiveQueryDB extends Dexie {
  friends!: Table<Friend, number>; // Define table with `id` as primary key

  constructor() {
    super("sveltelivequery");

    // Define schema
    this.version(4).stores({
      friends: "++id, name, age", // `++id` = auto-incrementing primary key
    });

    // Populate initial data if empty
    this.on("populate", async () => {
      await this.friends.bulkAdd([
        { name: "Foo", age: 22 },
        { name: "Bar", age: 23 },
      ]);
    });
  }
}

// Export a singleton instance of the database
export const db = new SvelteLiveQueryDB();
