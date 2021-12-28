<template>
  <div>
  <h3>
    Tic Tac Toe: Game of the Year Edition
  </h3>
  <TicTacToe />
  <ConnectFour />
  <ChessBoard />
  </div>

</template>

<script>
import TicTacToe from './components/TicTacToe';
import ChessBoard from './components/ChessBoard';
import ConnectFour from './components/ConnectFour';
export default {
  name: "App",
  components: {
    TicTacToe,
    ChessBoard,
    ConnectFour
  },
  methods: {
    increment() {
      console.log("test")
      this.$store.commit('increment')
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
