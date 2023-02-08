<template>
  <el-drawer
    title="Card setting"
    :visible="visible"
    direction="btt"
    :before-close="handleCloseDrawer"
    :withHeader="false"
    custom-class="radiusDrawer"
    size="80%"
  >
    <div class="drawerContent">
      <div class="drawerHead">
        <span class="drawerTitle">Card setting</span>
        <i class="el-icon-circle-close" @click="handleCloseDrawer"></i>
      </div>
      <TradeRecordContent :records="records" />
    </div>
  </el-drawer>
</template>

<script>
import EmptyData from "@/components/EmptyData";
import TradeRecordContent from './TradeRecordContent';

export default {
  props: {
    visible: Boolean,
  },
  components: {
    EmptyData,
    TradeRecordContent,
  },
  data() {
    return {
      isShowAll: false,
      records: [],
    };
  },
  methods: {
    // 交易记录列表
    getTradeRecordList(data) {
      this.records = [];
      if (data !== null) {
        this.records = data;
      }
    },
    handleCloseDrawer() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .radiusDrawer {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.drawerContent {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.38rem 0.26rem 0;
}

.drawerHead {
  position: relative;
  text-align: center;

  .drawerTitle {
    font-size: 0.3rem;
    color: #1a1a1a;
  }

  i {
    position: absolute;
    font-size: 0.28rem;
    color: #787878;
    right: 0;
    top: 0.08rem;
  }
}
</style>
