<template>
  <div class="stores">
    <input class="stores_search" type="text" placeholder="filter" v-model="keyword" />
    <div v-if="error"> ... ERROR ... </div>
    <ul v-else>
      <span v-if="pending"> ... LOADING ... </span>
      <li
        v-for="store in filteredStores"
        :key="store.ID"
        v-on:click="selectStoreParent(store.ID)">
        <span class="store-name">{{store.ID}}: {{ store.post_title }}</span><br>
        Latitude:  {{ store.lat }}
        Longitude: {{ store.lng }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
</style>

<script>
import { mapState } from "vuex";

export default {
  props: {
    selectStore: Function
  },
  data() {
    return {
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all,
      pending: state => state.stores.pending,
      error: state => state.stores.error
    }),
    filteredStores() {
      return this.keyword.length > 0
        ? this.stores.filter(item => {
            return (
              item.post_title
                .toLowerCase()
                .indexOf(this.keyword.toLowerCase()) > -1
            );
          })
        : this.stores;
    }
  },
  methods: {
    selectStoreParent(id) {
      debugger;
      return this.selectStore(id);
    }
  }
};
</script>
