<template>
  <div class="chargeRecord">
    <ul class="records" v-if="list.length > 0">
      <li class="record" v-for="item in list" :key="item.id">
        <div class="recordInfo">
          <span class="recordName">
            Charge Off to -({{item.withdrawGoal}})
          </span>
          <span class="recordNum">{{item.walletAddress | ellipsisBankCard}}</span>
          <div>
            <el-tag size="mini" effect="plain">{{item.typeDesc}}</el-tag>
          </div>
        </div>
        <div class="otherInfo">
          <span class="amount">-{{item.withdrawAmount.toFixed(2)}}</span>
          <span class="status">{{item.statusDesc}}</span>
          <span class="recordDate">{{item.withdrawTime}}</span>
        </div>
      </li>
    </ul>
    <EmptyData top="25%" v-else />
  </div>
</template>

<script>
import EmptyData from "@/components/EmptyData";
import API from '@/service/index';

export default {
  components: {
    EmptyData
  },
  filters: {
    ellipsisBankCard(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 6)}********${value.substring(value.length - 10)}`;
        }
        return value;
    },
    ellipsisBankCardSuffix(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(value.length - 4)}`;
        }
        return value;
    },
  },
  data () {
    return {
      list: [],
    }
  },
  mounted() {this.getCurrentUser();
    // 提现列表
    this.getWithdrawList();
  },
  methods: {
    // 查询用户提现列表
    getWithdrawList() {
      API.getWithdrawList({ certificationId: window.localStorage.getItem("loginId") }).then(result => {
          // console.log("提现列表：" + JSON.stringify(result));
          if (result.code !== 200) {
            this.common.notification(this, "Data loading failure", 3);
            return;
          }
          if (result.data !== null) {
            this.list = result.data;
          }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.chargeRecord {
  border-top: 0.2rem solid #F7F7F7;
}
.records {
  padding: 0.29rem 0.23rem;
}
.record {
  display: flex;
  justify-content: space-between;
  padding: 0.17rem 0;
  border-bottom: 1px solid #eee;
}
.recordInfo {
  display: flex;
  flex-direction: column;
  .recordName {
    font-size: 0.28rem;
    color: #333;
  }
  .recordNum {
    margin-top: 0.17rem;
    margin-bottom: 0.18rem;
    font-size: 0.24rem;
    color: #999;
  }
}
.recordDate {
  font-size: 0.22rem;
  color: #999;
  font-weight: 500;
}
.amount {
  font-size: 0.3rem;
  color: #333;
  font-weight: bold;
}
.otherInfo {
  display: flex;
  flex-direction: column;
  text-align: right;
  .status {
    margin-top: 0.17rem;
    margin-bottom: 0.3rem;
    font-size: 0.24rem;
    color: #999;
    font-weight: 500;
  }
}
</style>
