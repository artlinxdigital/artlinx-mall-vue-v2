<template>
  <el-dialog
    title=""
    class="emptyDialog"
    :visible="visible"
    width="71%"
    :before-close="handleClose"
    :show-close="false"
    top="55%"
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

export default {
  components: {
    ChangeNumberInput,
  },
  props: {
    visible: Boolean,
    originPrice: [String, Number],
    pricePlaceholder: "Please enter commodity price",
    coin: String,
  },
  data() {
    return {
      price: "",
    };
  },
  mounted() {
    this.getCurrentUser();
    if (this.originPrice) {
      this.price = this.originPrice;
    }
  },
  methods: {
    // 重新上架
    onlineAgain() {
      this.$emit("onlineAgain", this.price);
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less" scoped>
.modalContent {
  padding: 0.81rem 0.67rem 0.3rem;
  background: #fff;
  border-radius: 0.16rem;
  .title {
    margin-bottom: 0.23rem;
    font-size: 0.28rem;
    color: #333;
  }
  .iconMony {
    font-size: 0.3rem;
    color: #8ddbe8;
  }
  /deep/ .el-input--prefix .el-input__inner {
    color: #8ddbe8;
  }
  .btnCenter {
    display: flex;
    text-align: center;
  }
  .btnConfirm {
    width: 2.4rem;
    margin: 0.71rem auto 0;
    border-radius: 0.5rem;
  }
}
</style>
