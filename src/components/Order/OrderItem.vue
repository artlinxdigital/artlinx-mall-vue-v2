<template>
  <li class="orderItem">
    <div class="orderContent">
      <div class="imgBox">
        <el-image
          class="coverImg"
          :src="audioImg"
          fit="cover"
          v-if="item.productType === 2"
        >
          <div slot="placeholder">
            <el-image :src="placeholderImg" fit="cover" lazy></el-image>
          </div>
        </el-image>
        <el-image class="coverImg" :src="videoImg" fit="cover" v-if="false">
          <div slot="placeholder">
            <el-image :src="placeholderImg" fit="cover" lazy></el-image>
          </div>
        </el-image>
        <el-image
          v-if="item.coverImage"
          class="coverImg"
          :src="'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' +  item.coverImage + '/public'"
          fit="cover"
        >
          <div slot="placeholder">
            <el-image :src="placeholderImg" fit="cover" lazy></el-image>
          </div>
        </el-image>
      </div>
      <div class="orderInfo">
        <div class="namePrice">
          <span class="goodsName">{{ item.productName }}</span>
          <span class="goodsPrice"
            >{{ coinMap[item.coinType] }}:{{
              item.tradeAmount.toFixed(2)
            }}</span
          >
        </div>
        <div class="goodsType">{{ item.categoryName }}</div>
        <div class="totalInfo">
          <div><span class="label">Quantity：</span><span>1</span></div>
          <span class="serviceTxt"
            >Services fee {{ coinMap[item.coinType] }}:{{
              item.tradeFee.toFixed(2)
            }}</span
          >
        </div>
      </div>
    </div>
    <div class="orderHead">
      <span class="time">{{ item.createTime }}</span>
      <span class="orderStatus compelete"
        >{{ item.tradeStatusDesc }}-{{ item.tradeTypeDesc }}</span
      >
    </div>
  </li>
</template>

<script>
import { constractAddress, config, coinMap } from "@/const/const";
import API from "@/service";
export default {
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {
      audioImg: require("@/assets/images/yinpin@2x.png"),
      videoImg: require("@/assets/images/shipin@2x.png"),
      placeholderImg: require("@/assets/images/artlinx_loading.jpg"),
      coinMap: {},
    };
  },
  mounted() {
    this.getCurrentUser();
    this.coinMap = coinMap;
  },
};
</script>

<style lang="less" scoped>
.orderItem {
  margin-top: 0.16rem;
  padding: 0 0.15rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.1rem;
}
.orderHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.15rem 0;

  .time {
    font-size: 0.12rem;
    color: #b0b0b0;
  }
  .orderStatus {
    font-size: 0.12rem;
    &.compelete {
      color: #707070;
    }
  }
}
.orderContent {
  display: flex;
  padding: 0.15rem 0 0;
  .imgBox {
    width: 0.66rem;
    height: 0.68rem;
    margin-right: 0.15rem;
    border-radius: 0.08rem;
    .coverImg {
      width: 100%;
      height: 100%;
      border-radius: 0.08rem;
    }
  }
}
.orderInfo {
  flex: 1;
  line-height: 0.3rem;
}
.namePrice {
  display: flex;
  justify-content: space-between;
  .goodsName {
    line-height: 0.2rem;
    font-size: 0.14rem;
  }
  .goodsPrice {
    font-size: 0.14rem;
  }
}
.goodsType {
  display: inline-block;
  padding: 0.04rem 0rem;
  font-size: 0.12rem;
  color: #000000;
}
.totalInfo {
  display: flex;
  justify-content: space-between;
  color: #707070;
  span {
    font-size: 0.12rem;
  }
  .serviceTxt {
    margin-left: 0.05rem;
    font-size: 0.12rem;
  }
}
.totalPrice {
  font-size: 0.14rem;
}
</style>
