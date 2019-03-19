<template>
  <div :class="{ open: opened, filter: true }">
    <span class="title" @click="toggleTitle">
      {{ type[0].toUpperCase() + type.slice(1) }}
    </span>
    <ul>
      <li v-for="dimension in dimensions" :key="dimension">
        <label>
          <input type="checkbox" @click="selectFilter" :name="type" :value="dimension" /> {{ dimension }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      opened: false
    };
  },
  props: {
    type: String
  },
  computed: {
    ...mapState({
      stores: state => state.stores.all
    }),
    dimensions() {
      return [
        ...this.stores.reduce(
          (acc, curr) => acc.add(curr[this.type]),
          new Set([])
        )
      ].filter(i => i);
    }
  },
  methods: {
    toggleTitle() {
      this.opened = !this.opened;
    },
    selectFilter(filter) {
      this.$store.dispatch({
        type: "stores/filterToggle",
        id: {
          name: filter.target.name,
          value: filter.target.value,
          checked: filter.target.checked
        }
      });
    }
  }
};
</script>

<style lang="scss">
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.filter {
  padding: 4px;
  margin-bottom: 2px;
  border: 1px solid black;
  text-align: center;
  height: 45px;
  overflow: hidden;
  &.open {
    height: 100%;
  }
  ul {
    text-align: left;
  }
  .title {
    display: block;
    line-height: 2.2;
    font-weight: bold;
  }
}
</style>
