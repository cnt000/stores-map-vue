<template>
  <div class="home">
    <StoresList />
  </div>
</template>

<script>
// @ is an alias to /src
import StoresList from "@/components/StoresList.vue";

export default {
  name: "home",
  components: {
    StoresList
  }
};
</script>
