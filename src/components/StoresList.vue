<template>
  <div class="stores">
    <div>
      <input
        class="stores_search"
        type="text"
        placeholder="filter"
        v-model="keyword"
      />
      <span v-if="pending">... LOADING ...</span>
      <span v-if="error">... ERROR!!! ...</span>
      <ul class="stores_list">
        <li
          v-if="active.length === 0"
          class="stores_list_store stores_list_store--empty"
        >
          Non ci sono risultati
        </li>
        <li
          v-else
          v-for="store in active"
          :data-storeid="store.id"
          :key="store.id"
          v-on:click="selectStore(store.id)"
          :class="{ selected: storeId === store.id, stores_list_store: true }"
        >
          <div class="stores_list_store_name" :title="store.name">
            {{ store.name }}
          </div>
          <div class="stores_list_store_address">{{ store.address }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      active: state => state.stores.active,
      storeId: state => state.stores.selectedId,
      pending: state => state.stores.pending,
      error: state => state.stores.error
    }),
    keyword: {
      set: function(newValue) {
        this.$store.dispatch({
          type: "stores/updateKeyword",
          id: newValue
        });
      },
      get: function() {
        return this.$store.state.stores.keyword;
      }
    }
  },
  methods: {
    selectStore(clickedId) {
      this.$store.dispatch({
        type: "stores/selectStore",
        id: clickedId
      });
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
.stores {
  overflow: hidden;
  height: 100vh;
  > div {
    height: inherit;
  }
  &_search {
    border: 1px solid black;
    width: 100%;
    height: 56px;
    font-size: 18px;
    border-bottom: 0;
    text-indent: 8px;
    &::placeholder {
      font-size: 14px;
    }
  }
  &_list {
    border-top: 1px solid black;
    box-sizing: border-box;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: calc(100vh - 60px);
    &_store {
      border: 1px solid black;
      border-top: none;
      padding: 4px;
      height: 60px;
      cursor: pointer;
      overflow: hidden;
      &--empty {
        background-color: lightsalmon;
      }
      &:hover {
        background-color: lightgreen;
      }
      &:active {
        background-color: lightcoral;
      }
      &_name {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &_address {
        font-size: 80%;
      }
      &.selected {
        background: lightcyan;
      }
    }
  }
}
</style>
