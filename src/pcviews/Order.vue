<template>
  <div
    class="pageContainer order"
    v-infinite-scroll="getMyOrderList"
    :infinite-scroll-disabled="disabled"
  >
    <PersonalCenterLayout activeKey="3-4">
      <div class="pcPageContainer">
        <div class="pageContHead">Records</div>
        <EmptyData top="25%" v-if="list.length <= 0" />
        <ul class="orderListBox" v-else>
          <OrderItem v-for="item in list" :item="item" :key="item.id" />
        </ul>
      </div>
    </PersonalCenterLayout>

  </div>
</template>

<script>
import { InfiniteScroll } from "element-ui";
import MPageHeader from "@/components/MPageHeader";
import EmptyData from "@/components/EmptyData";
import PersonalCenterLayout from "@/components/PersonalCenterLayout";
import OrderItem from "@/components/Order/OrderItemPc";

export default {
  components: {
    MPageHeader,
    EmptyData,
    PersonalCenterLayout,
    OrderItem
  },
  data() {
    return {
      loading: false,
      noMore: false,
      pageNum: 1,
      total: 0,
      list: [],
      audioImg: require("@/assets/images/yinpin@2x.png"),
      videoImg: require("@/assets/images/shipin@2x.png"),
      placeholderImg: require('@/assets/images/artlinx_loading.jpg'),
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {this.getCurrentUser();
    // 订单列表
    // this.getMyOrderList();
  },
  methods: {
    // 查询我的订单列表
    getMyOrderList() {
      if (this.disabled) return;
      this.loading = true;
      this.$API
        .getCollectionTradeList({
          certificationId: window.localStorage.getItem("loginId"),
          pageNum: this.pageNum,
        })
        .then((result) => {
          if (result && result.code !== 200) {
            this.common.notification(this, "Data loading failure,Please wait for a moment！", 3);
            this.loading = false;
            return;
          }
          if (result && result.data !== null) {
            this.total = result.data.totalCount;
            if (!this.noMore) {
              const list = result.data.list.map(item => {
                return {
                  ...item,
                  tradeFee: item.tradeFee || 0
                }
              });
              this.list = [...this.list, ...list];
              this.noMore = this.list.length >= this.total;
              this.pageNum += 1;
            }
          }
          this.loading = false;
        });
    },
  },
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
};
</script>

<style lang="less" scoped>
.order {
  min-height: 100vh;
  overflow-y: auto;
}
.pcPageContainer {
  min-height: 90vh;
}
.pageContHead {
		font-size: 24px;
		margin-bottom: 40px;
	}
</style>
