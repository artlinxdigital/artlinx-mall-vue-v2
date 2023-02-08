<template>
  <section class="tradeInfo">
    <h3 class="panelTitle">Trade History</h3>
    <div class="listBox scrollbar" :class="{ empty: records.length <= 0 }">
      <EmptyBox title="No data" v-if="records.length <= 0" />
      <ul>
        <li class="tradeLi" v-for="(item, index) in records" :key="item.id">
          <div class="tradeLiLt">
            <!--            32，M最后一条,其他都是T-->
            <div class="avatar">
              <span v-if="index === records.length - 1" class="icon-c">M</span>
              <span v-else class="icon-c2">T</span>
            </div>
            <div class="tradeInfoIn">
              <span class="owner">{{ item.ownerNickName }}</span>
              <span class="address" @click="jumpToBlockChain(item.tradeHash)">{{
                item.tradeHash | ellipsisAddress
              }}</span>
              <span class="date">{{ item.createTime }}</span>
            </div>
          </div>
          <div class="tradeLiRt">
            <i class="icMony">{{ coinMap[item.coinType] }}:</i>
            <span class="price">{{ item.price | priceFilter }}</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import EmptyBox from "@/components/EmptyBox";
import {   constractAddress, config, coinMap } from "@/const/const";

export default {
  props: {
    records: Array,
  },
  components: {
    EmptyBox,
  },
  data() {
    return {
      coinMap: {},
    };
  },
  filters: {
    ellipsisAddress(value) {
      if (!value) return "";
      if (value.length > 10) {
        const clientWidth = document.documentElement.clientWidth;
        const subLen = clientWidth > 800 ? 8 : 4;
        return `${value.substring(0, subLen)}********${value.substring(
          value.length - subLen
        )}`;
      }
      return value;
    },
    priceFilter(num) {
      num = num.toFixed(2).toString().replace(/,/g, "");
      const num1 = num.split(".")[0];
      const num2 = num.split(".")[1];
      const c = num1.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      return num.toString().indexOf(".") !== -1 ? c + "." + num2 : c;
    },
    ellipsisNickName(value) {
      if (!value) return "";
      if (value.length > 4) {
        if (value.length > 8) {
          return `${value.substring(0, 4)}****${value.substring(
            value.length - 4
          )}`;
        }
        return `${value.substring(0, 2)}****${value.substring(
          value.length - 2
        )}`;
      }
      return value;
    },
  },
  mounted() {this.getCurrentUser();
    this.coinMap = coinMap;
  },
  methods: {
    // 跳转区块链浏览器查看交易详情
    jumpToBlockChain(tradeHash) {
      if (tradeHash) {
        const jumpBrowserUrl = config.exploderURI + "/tx/" + tradeHash;
        window.open(jumpBrowserUrl);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.icon-c {
  background: #fe2d46;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  color: #ffffff;
  border-radius: 2px;
}
.icon-c2 {
  background: #1b9d2b;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  color: #ffffff;
  border-radius: 2px;
}
.panelTitle {
  margin-bottom: 0.32rem;
  font-size: 0.24rem;
  font-weight: 500;
  color: #000000;
  line-height: 0.36rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.25rem;
    font-size: 0.18rem;
    line-height: 0.27rem;
  }
}
.listBox {
  height: 4.08rem;
  overflow-y: auto;
  overflow-x: hidden;
  &.empty {
    background: rgba(177, 181, 212, 0.01);
    border-radius: 0.04rem;
    @media screen and (max-width: 800px) {
      background: none;
      border-radius: 0;
    }
  }
  @media screen and (max-width: 800px) {
    height: auto;
    min-height: 2rem;
  }
}
.tradeLi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.16rem;
  padding: 0.26rem 0.32rem;
  background: rgba(177, 181, 212, 0.06);
  border-radius: 0.16rem;
  @media screen and (max-width: 800px) {
    padding: 0.26rem 0.16rem;
    margin-bottom: 0.12rem;
  }
}
.tradeLiLt {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    width: 60%;
    overflow: hidden;
  }
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
    max-width: 0.45rem;
    height: 0.45rem;
    margin-right: 0.1rem;
    border-radius: 100%;
    background: rgba(255, 255, 255, 0.08);
    color: #000000;
    @media screen and (max-width: 800px) {
      max-width: 0.4rem;
      min-width: 0.3rem;
      height: 0.4rem;
    }
  }
}
.tradeInfoIn {
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 800px) {
    // width: 80%;
  }
  .owner {
    margin-bottom: 0.12rem;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
  }
  .address {
    font-size: 12px;
    color: #505050;
    cursor: pointer;
  }
  .date {
    margin-top: 0.12rem;
    font-size: 12px;
    color: #909090;
  }
}
.tradeLiRt {
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    flex: 1;
    text-align: right;
  }
  .icMony {
    margin-right: 0.08rem;
    font-size: 14px;
    font-weight: 500;
    color: #ffc921;
  }
  .price {
    font-size: 23px;
    font-weight: bold;
    font-family: "NotoSansCJK", "DINAlternate-Bold", "DINAlternate";
    color: #ffc921;
    word-break: break-all;
    @media screen and (max-width: 800px) {
      font-size: 18px;
    }
  }
}
</style>
