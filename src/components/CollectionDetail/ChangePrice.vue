<template>
  <el-dialog
    title=""
    class="emptyDialog"
    :visible="visible"
    :width="clientWidth > 800 ? '30%' : '90%'"
    :before-close="handleClose"
    :show-close="false"
    append-to-body
  >
    <div class="modalContent">
      <div class="title">Current commodity price:</div>
      <div>
        <!-- <el-input
          placeholder="请输入商品price"
          v-model="price"
          onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          ref="priceInput"
        >
          <i slot="prefix" class="el-input__icon iconMony">HK$</i>
          <i slot="suffix" class="el-input__icon el-icon-edit" @click="$refs.priceInput.focus()"></i>
        </el-input> -->
        <ChangeNumberInput
          v-model.trim="price"
          :placeholder="pricePlaceholder"
          :coin="coinName"
          @updateCoin="updateCoin"
        />
      </div>
      <div class="btnCenter">
        <el-button type="primary" class="btnConfirm" @click="handleClose"
          >cancel</el-button
        >
        <el-button type="primary" class="btnConfirm" @click="onlineAgain"
          >confirm</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ChangeNumberInput from "@/components/Magic/ChangeNumberInput";
import { constractAddress, config, coinMap } from "@/const/const";
const ZERO = "0x0000000000000000000000000000000000000000";

export default {
  components: {
    ChangeNumberInput,
  },
  props: {
    visible: Boolean,
    originPrice: [String, Number],
    clientWidth: Number,
    coin: String,
  },
  data() {
    return {
      price: "",
      pricePlaceholder: "Please enter commodity price",
      web3: null,
      coinType: "ETH",
      coinName: "ETH",
      coinAddress: ZERO,
      coinArr: [],
    };
  },
  mounted() {
    this.getCurrentUser();
    if (this.originPrice) {
      this.price = this.originPrice;
    }
    this.coinName = coinMap[this.coin];
    this.coinArr = constractAddress.coinType;
    this.coinAddress = this.coin;
    if (this.coinName != "ETH") {
      this.coinType = "ERC20";
    }
  },
  methods: {
    updateCoin(address) {
      console.log("address;", address);
      switch (address) {
        case ZERO:
          this.coinType = "ETH";
          this.coinName = "ETH";
          this.coinAddress = ZERO;
          break;
        default:
          this.coinAddress = address;
          this.coinType = "ERC20";
          var coinArr = constractAddress.coinType;
          for (let i = 0; i < coinArr.length; i++) {
            if (coinArr[i].address == address) {
              this.coinName = coinArr[i].name;
              break;
            }
          }
          break;
      }
    },
    // 重新上架
    onlineAgain() {
      if (!this.price || parseFloat(this.price) <= 0) {
        this.common.notification(
          this,
          "Please enter the correct commodity price",
          2
        );
        return;
      }
      this.$emit("onlineAgain", this.price, this.coinAddress);
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.modalContent {
  padding: 0.5rem 0.4rem;
  background: #ffffff;
  border-radius: 0.1rem;
  filter: blur(0) brightness(100%);
  backdrop-filter: blur(0.18rem);
  .title {
    margin-bottom: 0.16rem;
    font-size: 0.14rem;
    color: #000000;
  }
  .iconMony {
    font-size: 0.14rem;
    color: #000000;
  }
  /deep/ .el-input__inner {
    background-color: #ffffff;
    border: 1px solid #000000;
  }
  /deep/ .el-input--prefix .el-input__inner {
    color: #000000;
  }
  .btnCenter {
    display: flex;
    text-align: center;
  }
  .btnConfirm {
    width: 2.4rem;
    margin: 0.5rem auto 0;
    border-radius: 0.5rem;
  }
}
</style>
