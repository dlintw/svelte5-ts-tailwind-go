import Dexie from "dexie";

export const db = new Dexie("sveltelivequery");
db.version(4).stores({
  friends: "++id, name, age",
});

db.on("populate", () => {
  db.friends.bulkAdd([
    {
      name: "Foo",
      age: 22,
    },
    {
      name: "Bar",
      age: 23,
    },
  ]);
});
