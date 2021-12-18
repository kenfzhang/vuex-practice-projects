<template>
  <div>
    <h3>
      <button @click="makeMove({i:0,j:0,k:this.$store.state.turn})">{{this.$store.state.board[0][0]}}</button>
      <button @click="makeMove({i:0,j:1,k:this.$store.state.turn})">{{this.$store.state.board[0][1]}}</button>
      <button @click="makeMove({i:0,j:2,k:this.$store.state.turn})">{{this.$store.state.board[0][2]}}</button>
    </h3>
    <h3>
      <button @click="makeMove({i:1,j:0,k:this.$store.state.turn})">{{this.$store.state.board[1][0]}}</button>
      <button @click="makeMove({i:1,j:1,k:this.$store.state.turn})">{{this.$store.state.board[1][1]}}</button>
      <button @click="makeMove({i:1,j:2,k:this.$store.state.turn})">{{this.$store.state.board[1][2]}}</button>
    </h3>
    <h3>
      <button @click="makeMove({i:2,j:0,k:this.$store.state.turn})">{{this.$store.state.board[2][0]}}</button>
      <button @click="makeMove({i:2,j:1,k:this.$store.state.turn})">{{this.$store.state.board[2][1]}}</button>
      <button @click="makeMove({i:2,j:2,k:this.$store.state.turn})">{{this.$store.state.board[2][2]}}</button>
    </h3>

    <h4 v-if="!this.$store.state.gameOngoing">
      a winner is you
    </h4>

    <button @click="showValue">heeaauugghgh</button>
  </div>
</template>

<script>
export default {
  methods: {
    showValue() {
      console.log(this.$store.state);
    },
    makeMove(indexes) {
      this.$store.commit('makeMove',indexes)
    }
  },
};
</script>

<style></style>
