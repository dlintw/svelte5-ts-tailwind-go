export interface Store {
  name: string;
}

export const store = $state({
  name: "world",
} as Store);
