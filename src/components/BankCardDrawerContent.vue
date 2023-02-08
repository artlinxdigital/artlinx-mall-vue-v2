<template>
  <div class="drawerContent">
    <ul class="bankList" v-if="bankConfigList.length > 0">
      <li
        class="bankCard"
        v-for="item in bankConfigList"
        :key="item.withdrawConfigId"
        @click="handleSelectCard(item.withdrawConfigId)"
      >
        <div class="bankCardLt">
          <div class="bankIcon" :class="item.bankStyle"></div>
          <div class="bankInfo">
            <span class="bankName">{{item.accountBank}}</span>
            <p class="cardNum">{{item.bankCard | ellipsisBankCard}}</p>
          </div>
        </div>
        <i class="el-icon-success" v-show="item.withdrawConfigId === activeCardId"></i>
      </li>
      <li class="addCard" @click="linkToUrl('/add-bank')">
        <span class="bankName"><i class="el-icon-plus"></i>Add or change bank card</span>
        <i class="el-icon-arrow-right"></i>
      </li>
    </ul>
    <div class="btnBox">
      <el-button type="primary" class="confirmBtn" @click="selectCard">confirm</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bankConfigList: Array
  },
  filters: {
    ellipsisBankCard(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 4)}************${value.substring(value.length - 4)}`;
        }
        return value;
    }
  },
  data () {
    return {
      bankList: [
        {
          id: "1",
          name: "CCB ",
          cardNum: "62216722********672"
        },
        {
          id: "2",
          name: "CCB ",
          cardNum: "62216722********672"
        }
      ],
      activeCardId: 0,
    }
  },
  methods: {
    linkToUrl (path) {
      this.$router.push({
        path: path
      });
    },
    handleSelectCard (id) {
      this.activeCardId = id;
    },
    // 选中bank card
    selectCard() {
      if (this.activeCardId == 0) {
        this.common.notification(this, "Please select a withdrawal account number", 2);
        return;
      }
      this.$emit("selectCard", this.activeCardId);
    }
  }
}
</script>

<style lang="less" scoped>
.drawerContent {
  padding: 0.53rem 0.25rem 0.6rem;
}
.flexCenterBtw {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bankCard {
  .flexCenterBtw();
  padding: 0.3rem 0;
  border-bottom: 1px solid #eee;
  .el-icon-success {
    font-size: 0.26rem;
    color: #000000;
  }
}
.bankCardLt {
  display: flex;
  .bankIcon {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.32rem;
    border: 0.01rem solid #e1e1e1;
    border-radius: 0.15rem;
    &.gongshang {
      background: #fff url('../assets/images/bank/zhongguogongshangyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.jianshe {
      background: #fff url('../assets/images/bank/zhongguojiansheyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.zhonguo {
      background: #fff url('../assets/images/bank/zhongguoyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.youzheng {
      background: #fff url('../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.nongye {
      background: #fff url('../assets/images/bank/nongyeyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.jiaotong {
      background: #fff url('../assets/images/bank/jiaotongyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.zhaoshang {
      background: #fff url('../assets/images/bank/zhaoshangyinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.pufa {
      background: #fff url('../assets/images/bank/pufayinhang@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
    &.pingan {
      background: #fff url('../assets/images/bank/zhongguopingan@2x.png') no-repeat center;
      background-size: 0.28rem 0.28rem;
    }
  }
  .bankName {
    font-size: 0.28rem;
    color: #333;
    line-height: 1;
  }
  .cardNum {
    margin-top: 0.24rem;
    font-size: 0.24rem;
    color: #000000;
    line-height: 1;
  }
}
.addCard {
  .flexCenterBtw();
  padding: 0.3rem 0;
  border-bottom: 1px solid #eee;
  .el-icon-plus {
    margin-right: 0.39rem;
    font-size: 0.36rem;
    color: #5C5C5C;
  }
  .el-icon-arrow-right {
    font-size: 0.24rem;
    color: #989898;
  }
}
.btnBox {
  text-align: center;
  .confirmBtn {
    width: 4.08rem;
    height: 0.8rem;
    margin: 1.16rem auto 0;
    border-radius: 0.4rem;
  }
}
</style>
