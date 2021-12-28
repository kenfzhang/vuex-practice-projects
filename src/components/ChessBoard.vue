<template>
  <div>
    <h3>Chess Board</h3>
    <div class="chessboard">
      <table class="board">
        <tr v-for="(row, x) in this.$store.state.chessboard" :key="row.id">
          <td
            :class="{ selectable: this.$store.state.chessMoves[x][y] }"
            v-for="(square, y) in row"
            :key="square.id"
            @click="movePiece(x, y)"
          >
            <!-- {{ square }} -->
            <img
              class="chesspiece"
              :src="
                square ? require('@/assets/chesspieces/' + square + '.png') : ''
              "
              alt=""
              @click="selectPiece(square, x, y)"
            />
          </td>
        </tr>
      </table>
    </div>

    <button
      @click="cancelMove"
      v-if="this.$store.state.chessState === 'selected'"
    >
      cancel
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      pogFlag: true,
    };
  },
  methods: {
    nyeh() {
      console.log(this.$store.state.chessboard[6][0]);
    },
    selectPiece(piecename, x, y) {
      console.log(piecename, x, y);
      if (this.$store.state.chessState === "unselected") {
        this.$store.commit("selectPiece", { piecename, x, y });
      }
    },
    cancelMove() {
      this.$store.commit("unselectPiece");
    },
    movePiece(x, y) {
      console.log("POGGERS", x, y);
      this.$store.commit("movePiece", { x, y });
    },
  },
};
</script>

<style>
.chesspiece {
  max-width: 79px;
  max-height: 79px;
}
.chessboard {
  margin: auto;
  font-size: 20px;
  border: 1px solid #c3c3c3;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}
.selectable {
  background-color: #008 !important;
}

tr td {
  background-color: #bbb;
  width: 80px;
  height: 80px;
}

tr:nth-child(even) td:nth-child(odd),
tr:nth-child(odd) td:nth-child(even) {
  background-color: #888;
}
</style>
