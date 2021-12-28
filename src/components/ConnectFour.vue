<template>
  <div>
    <h3>Connect Four: Revengeance</h3>

    <div class="c4board">
      <div v-for="row in this.$store.state.c4board" :key="row.id">
        <span v-for="item in row" :key="item.id">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="c4board">
      <span
        @click="makeC4Move(item)"
        v-for="item in [0, 1, 2, 3, 4, 5, 6]"
        :key="item.id"
      >
        {{ item }}
      </span>
    </div>

    <h4 v-if="!this.$store.state.c4gameOngoing">a winner is you</h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numbers: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      carets: ["^", "^", "^", "^", "^", "^", "^"],
    };
  },
  methods: {
    makeC4Move(index) {
      // console.log(index)

      // update store with passed index
      this.$store.commit("makeC4Move", index);
    },
  },
};
</script>

<style>
.c4board {
  font-family: "Courier New", Courier, monospace;
  font-size: 36px;
}
</style>
