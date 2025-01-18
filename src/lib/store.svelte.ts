export interface Store {
  name: string;
  count: number;
}

export const store = $state({
  name: "world",
  count: 0,
} as Store);
