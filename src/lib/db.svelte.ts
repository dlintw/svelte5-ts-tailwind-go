import Dexie from "dexie";
import type { Table } from "dexie";

export interface Settings {
  id?: number;
  namePattern: string;
  minAge: number;
  maxAge: number;
  orderBy: string;
  offset: number;
  theme: string;
}

// Define the database schema
export interface Friend {
  id?: number; // Auto-incremented primary key
  name: string;
  age: number;
}

class MyDB extends Dexie {
  friends!: Table<Friend, number>; // Define table with `id` as primary key
  settings!: Table<Settings, number>;

  constructor() {
    super("MyDB");

    // Define schema
    this.version(1).stores({
      friends: "++id, name, age", // `++id` = auto-incrementing primary key
      settings: "++id,namePattern,minAge,maxAge,orderBy,offset,theme",
    });

    // Populate initial data if empty
    this.on("populate", async () => {
      await this.friends.bulkAdd([
        { name: "Foo", age: 22 },
        { name: "Bar", age: 23 },
      ]);
      await this.settings.bulkAdd([
        {
          namePattern: "",
          minAge: 18,
          maxAge: 65,
          orderBy: "name",
          offset: 0,
          theme: "light",
        },
      ]);
    });
  }
}

// Reactive state for settings
export const settings = $state<Settings>({
  namePattern: "",
  minAge: 18,
  maxAge: 65,
  orderBy: "name",
  offset: 0,
  theme: "light",
});

// Function to load settings from IndexedDB
export async function loadSettings(): Promise<void> {
  try {
    // Fetch the first settings entry (assuming there's only one)
    const savedSettings = await db.settings.get(1);
    if (savedSettings) {
      // Update the reactive state with the loaded settings
      Object.assign(settings, savedSettings);
    } else {
      console.log("No settings found in IndexedDB.");
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
}

// Function to save settings to IndexedDB
export async function saveSettings(): Promise<void> {
  try {
    await db.settings.put({ id: 1, ...settings }); // Save or update settings with ID 1
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}
// Export a singleton instance of the database
export const db = new MyDB();
