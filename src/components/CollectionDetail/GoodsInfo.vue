<template>
  <section class="goodsDescPane">
    <h3 class="panelTitle">Detail of Item</h3>

    <div class="chainNft">
      <span class="date"
        >Contract address：{{ contractAddress | formatAddress }}</span
      >
      <el-button
        type="primary"
        class="btnCopy"
        size="mini"
        v-clipboard:copy="contractAddress"
        v-clipboard:success="onCopy"
        >copy</el-button
      >
    </div>
    <br />
    <div class="chainNft">
      <span class="date">Token id：{{ tokenId | formatTokenId }}</span>
      <el-button
        type="primary"
        class="btnCopy"
        size="mini"
        v-clipboard:copy="tokenId"
        v-clipboard:success="onCopy"
        >copy</el-button
      >
    </div>
  </section>
</template>

<script>
import Web3 from "web3";
export default {
  props: {
    contractAddress: {
      type: String,
    },
    tokenId: {
      type: String,
    },
    date: String,
  },
  filters: {
    formatAddress(value) {
      if (!value) return "";
      if (value.length > 10) {
        if (!value) {
          return "";
        }

        return (
          value.substring(0, 6) +
          "..." +
          value.substring(value.length - 4, value.length)
        );
      }
      return value;
    },
    formatTokenId(value) {
      if (!value) return "";
      if (value.length > 14) {
        if (!value) {
          return "";
        }
        if ((value.length == 66)) {
          value = Web3.utils.hexToNumberString(value);
        }
        return (
          value.substring(0, 9) +
          "..." +
          value.substring(value.length - 7, value.length)
        );
      }
      return value;
    },
  },
  methods: {
    onCopy() {
      this.$notify.success({
        title: "",
        message: "Copied success！",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.goodsDescPane {
  margin-bottom: 0.65rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.48rem;
  }
  .chainNft {
    display: flex;
    justify-content: space-between;
    align-items: self-end;
  }
  .btnCopy {
    padding: 0;
    width: 60px;
    height: 30px;
  }
}
.panelTitle {
  margin-bottom: 0.32rem;
  font-size: 0.24rem;
  font-weight: 500;
  color: #000000;
  line-height: 0.36rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.15rem;
    line-height: 0.3rem;
    font-size: 0.2rem;
  }
}
.goodsDescDetail {
  height: 0.89rem;
  overflow-y: auto;
  font-size: 0.14rem;
  font-weight: 400;
  color: #000000;
  line-height: 0.21rem;
  @media screen and (max-width: 800px) {
    height: auto;
    min-height: 0.89rem;
  }
}
.date {
  margin-top: 0.16rem;
  font-size: 0.14rem;
  color: #999999;
  line-height: 0.21rem;
}
</style>
