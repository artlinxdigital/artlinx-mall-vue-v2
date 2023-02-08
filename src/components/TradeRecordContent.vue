<template>
  <div class="drawerList">
    <div class="tradeRecords">
      <div class="drawerLine" v-if="records.length > 0"></div>
      <EmptyData :top="clientWidth > 800 ? '0' : '25%'" v-if="records.length <= 0" />
      <div class="recordContainer" :class="{ all: isShowAll }">
        <div class="record" v-for="(item, idx) in records" :key="item.id">
          <span class="recordDate" :class="{ isOdd: idx % 2 !== 0 }">{{
            item.createTime
          }}</span>
          <div class="recordInfo">
            <div>
              <p class="tradeName">
                {{ item.owner }}
              </p>
              <p class="tradeAddress">
                {{ item.tradeHash | ellipsisAddress }}
              </p>
            </div>
            <div class="price">
              <i>HK$</i>
              <span>{{ item.price.toFixed(2).split(".")[0] }}.</span>
              <span class="smNum">{{
                item.price.toFixed(2).split(".")[1]
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="iconMore" @click="handleShowMore" v-if="records.length > 3">
        <span>{{ isShowAll ? "put away" : "more" }}</span>
        <i class="el-icon-arrow-down" :class="{ rotate: isShowAll }"></i>
      </div>
    </div>
  </div>
</template>

<script>
import EmptyData from "@/components/EmptyData";

export default {
  components: {
    EmptyData
  },
  props: {
    records: Array,

  },
  data () {
    return {
      isShowAll: false,
      clientWidth: 750,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
  },
  methods: {
    handleShowMore() {
      this.isShowAll = !this.isShowAll;
    },
  },
  filters: {
    ellipsisAddress(value) {
      if (!value) return "";
      if (value.length > 10) {
        return `${value.substring(0, 12)}********${value.substring(
          value.length - 12
        )}`;
      }
      return value;
    },
  },
};
</script>

<style lang="less" scoped>
.record {
  display: flex;
  margin-top: 0.42rem;
  .recordDate {
    position: relative;
    width: 0.85rem;
    padding-top: 0.25rem;
    margin-right: 0.26rem;
    font-size: 0.16rem;
    color: #333333;
    @media screen and (max-width: 800px) {
      margin-right: 0.4rem;
      font-size: 0.24rem;
      &::before {
        content: "";
        display: inline-block;
        position: absolute;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../assets/images/yuan@2x.png") no-repeat center;
        background-size: cover;
        top: 0.25rem;
        left: 0.8rem;
        z-index: 9;
      }
    }
    &.isOdd {
      @media screen and (max-width: 800px) {
        &::before {
          background: url("../assets/images/yuan2@2x.png") no-repeat center;
          background-size: cover;
        }
      }
    }
  }
  .recordInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding-top: 0.25rem;
    padding-bottom: 0.14rem;
    border-bottom: 1px solid #e5e5e5;
  }
}
.recordContainer {
  // height: 4.6rem;
  overflow: hidden;
  &.all {
    height: auto;
  }
  @media screen and (max-width: 800px) {
    height: auto;
  }
}
.tradeName {
  margin-bottom: 0.1rem;
  font-size: 0.16rem;
  color: #1a1a1a;
  @media screen and (max-width: 800px) {
    font-size: 0.26rem;
  }
}
.tradeAddress {
  font-size: 0.14rem;
  color: #999999;
  @media screen and (max-width: 800px) {
    font-size: 0.22rem;
  }
}
.price {
  font-size: 0.2rem;
  color: #333333;
  i {
    font-size: 0.16rem;
    @media screen and (max-width: 800px) {
      font-size: 0.24rem;
    }
  }
  span {
    font-size: 0.31rem;
    @media screen and (max-width: 800px) {
      font-weight: bold;
    }
  }
  .smNum {
    @media screen and (max-width: 800px) {
      font-size: 0.22rem;
    }
  }
}
.iconMore {
  margin-top: 0.36rem;
  text-align: center;
  font-size: 0.16rem;
  color: #333333;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    display: none;
  }
  i {
    color: #585858;
    &.rotate {
      transform: rotate(180deg);
    }
  }
}
.drawerLine {
  position: absolute;
  width: 0.03rem;
  background: #eaedef;
  left: 0.95rem;
  top: 0.73rem;
  bottom: 0;
  @media screen and (min-width: 800px) {
    display: none;
  }
}

.drawerList {
  position: relative;
  flex: 1;
}
</style>
