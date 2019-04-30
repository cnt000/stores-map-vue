<template>
  <div :class="{ open: opened, filter: true }">
    <span class="filter_title" @click="toggleTitle">
      {{ type[0].toUpperCase() + type.slice(1) }}
    </span>
    <ul class="filter_list">
      <li v-for="dimension in dimensions" :key="dimension">
        <label>
          <input
            type="checkbox"
            @click="selectFilter"
            :name="type"
            :value="dimension"
          />
          {{ dimension }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

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
    ...mapGetters("stores", ["getDimensions"]),
    ...mapState({
      stores: state => state.stores.all
    }),
    dimensions() {
      return this.getDimensions(this.type);
    }
  },
  methods: {
    ...mapActions("stores", ["toggleDimension"]),
    toggleTitle() {
      this.opened = !this.opened;
    },
    selectFilter(filter) {
      const { name, value, checked } = filter.target;
      this.toggleDimension({
        name,
        value,
        checked
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
  &_title {
    display: block;
    line-height: 2.2;
    font-weight: bold;
  }
  &_list {
    text-align: left;
  }
}
</style>
