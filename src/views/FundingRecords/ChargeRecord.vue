<template>
  <div class="chargeRecord">
    <ul class="records" v-if="list.length > 0">
      <li class="record" v-for="item in list" :key="item.id">
        <div class="recordInfo">
          <span class="recordName">
            {{item.typeDesc}} Recorded to indicates the balance
          </span>
          <span class="recordNum">{{item.address | ellipsisAddress}}</span>
          <div>
            <el-tag size="mini" effect="plain">{{item.chargeSource}}</el-tag>
          </div>
        </div>
        <div class="recordRt">
          <span class="amount">+{{item.money.toFixed(2)}}</span>
          <span class="status">Has been Recorded</span>
          <div class="recordDate">{{item.chargeTime}}</div>
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
    ellipsisAddress(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 6)}********${value.substring(value.length - 10)}`;
        }
        return value;
    }
  },
  data () {
    return {
      list: [],
    }
  },
  mounted() {this.getCurrentUser();
    this.getChargeList();
  },
  methods: {
    // 查询用户充值列表
    getChargeList() {
      API.getChargeList({ certificationId: window.localStorage.getItem("loginId") }).then(result => {
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
    margin-bottom: 0.22rem;
    font-size: 0.28rem;
    color: #333;
  }
  .recordNum {
    margin-bottom: 0.22rem;
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
  margin-bottom: 0.21rem;
  font-size: 0.3rem;
  color: #333;
  font-weight: bold;
}
.recordRt {
  display: flex;
  flex-direction: column;
  text-align: right;
  .status {
    margin-bottom: 0.33rem;
    font-size: 0.22rem;
    color: #999;
  }
}
</style>
