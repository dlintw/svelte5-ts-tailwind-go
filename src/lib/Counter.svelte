<script lang="ts">
  import { store } from './store.svelte'

  const increment = () => {
    store.count += 1
  }
</script>

<button onclick={increment}>
  {store.name}, count is {store.count}
</button>
