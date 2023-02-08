<template>
  <li class="orderInfor">
    <div class="commodityInfor">
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
      <div class="name">
        <div class="fWhite">{{ item.productName }}</div>
        <div class="classify">{{ item.categoryName }}</div>
      </div>
    </div>
    <div class="Group">
      <div class="label">Quantity：</div>
      <div class="fWhite content">1</div>
    </div>
    <div class="Group">
      <div class="label">Time：</div>
      <div class="fWhite content">{{ item.createTime }}</div>
    </div>
    <div class="Group">
      <div class="label">Amount：</div>
      <div class="fWhite content">
        {{ coinMap[item.coinType] }}:{{ item.tradeAmount.toFixed(2)
        }}<span
          >Including fee {{ coinMap[item.coinType] }}:{{
            item.tradeFee.toFixed(2)
          }}</span
        >
      </div>
    </div>
    <div class="Group">
      <div class="label orderStatus">
        {{ item.tradeStatusDesc }}-{{ item.tradeTypeDesc }}
      </div>
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
.orderInfor {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.06);
  width: 100%;
  padding: 15px 20px;
  border-radius: 16px;
  margin-bottom: 15px;
  color: #b0b0b0;
}

.commodityInfor {
  display: flex;
  justify-content: flex-start;
  width: 200px;
  .name {
    margin-left: 20px;
  }
}

.imgBox,
.coverImg {
  width: 66px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}

.classify,
.label {
  font-size: 12px;
}

.orderStatus {
  color: #707070;
}

.content span {
  padding-left: 5px;
  font-size: 12px;
  color: #b0b0b0;
}

.name .fWhite {
  font-size: 16px;
}

.name,
.Group {
  line-height: 34px;
}
</style>
