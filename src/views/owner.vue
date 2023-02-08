<template>
  <div
    class="pageContainer owner"
    v-infinite-scroll="myNftList"
    :infinite-scroll-disabled="disabled"
  >
    <div class="mPage">
      <MPersonalCenterLayout activeKey="3-2">
        <div class="nftCondition">
          <el-tabs v-model="activeSelection" @tab-click="handleClickTab">
            <el-tab-pane
              v-for="item in selections"
              :key="item.productCategoryId"
              :label="item.categoryName"
              :name="item.productCategoryId"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <Collections
          listBg="#ffffff"
          :list.sync="list"
          :showOnSale="activeSelection == 1"
        />
        <p v-if="loading" class="loading"><i class="el-icon-loading"></i></p>
        <p v-if="list.length > 0 && noMore" class="noMore">
          <el-divider
            ><span style="color: #597a6ba5"
              >There is a BOTTOM LINE for digital art，Artlinx 2022</span
            ></el-divider
          >
        </p>
        <EmptyData top="25%" v-if="list.length <= 0" />
      </MPersonalCenterLayout>
    </div>
    <HomeFooter />
  </div>
</template>

<script>
import { InfiniteScroll } from "element-ui";
import HomeFooter from "./HomeFooter";
import Dropdown from "@/components/Dropdown";
import EmptyData from "@/components/EmptyData";
import SelectTab from "@/components/SelectTab";
import MPersonalCenterLayout from "@/components/MPersonalCenterLayout";
import Collections from "./Collections";
import API from "@/service/index";

export default {
  components: {
    HomeFooter,
    Collections,
    Dropdown,
    EmptyData,
    SelectTab,
    MPersonalCenterLayout,
  },
  data() {
    return {
      dropdownTypes: [
        {
          name: "price",
          type: "1",
        },
        {
          name: "time",
          type: "2",
        },
      ],
      loading: false,
      noMore: false,
      pageNum: 1,
      total: 0,
      list: [],
      selections: [
        {
          categoryName: "Owned",
          productCategoryId: "1",
        },
        {
          categoryName: "Sold out",
          productCategoryId: "2",
        },
      ],
      activeSelection: "1",
      opeType: 5,
      orderBy: "time desc",
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    // 我拥有的NFT
    myNftList() {
      if (this.disabled) return;
      this.loading = true;
      const param = {
        certificationId: window.localStorage.getItem("loginId"),
        opeType: this.opeType,
        orderBy: this.orderBy,
        pageNum: this.pageNum,
      };
      this.$API
        .myNftList(param)
        .then((result) => {
          if (result.code !== 200) {
            this.common.notification(
              this,
              "Data loading failure,Please wait for a moment！",
              3
            );
            return;
          }
          if (result.data !== null) {
            this.total = result.data.totalCount;
            if (!this.noMore) {
              const list = result.data.list;
              this.list = [...this.list, ...list];
              this.noMore = this.list.length >= this.total;
              this.pageNum += 1;
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          this.noMore = true;
          this.loading = false;
        });
    },
    handleSelectType(type) {
      this.pageNum = 1;
      this.list = [];
      this.noMore = false;
      if (type === "1") {
        this.orderBy = "price desc";
      } else {
        this.orderBy = "time desc";
      }
      this.myNftList();
    },
    handleClickTab(tab, event) {
      console.log(tab.name, event);
      this.pageNum = 1;
      this.list = [];
      this.noMore = false;
      if (this.activeSelection === "1") {
        this.opeType = 5;
      } else {
        this.opeType = 3;
      }
      this.myNftList();
    },
  },
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
};
</script>

<style lang="less" scoped>
.owner {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
}

.nftCondition {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
  /deep/ .el-tabs__nav-wrap::after {
    @media screen and (min-width: 800px) {
      height: 0;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
  @media screen and (max-width: 800px) {
    /deep/ .el-dropdown-link[data-v-d436187e] {
      font-size: 0.26rem;
      color: #333;
    }
    /deep/ .el-tabs__item {
      font-size: 0.14rem;
      color: #000000;
    }
    /deep/ .el-tabs__nav-wrap::after {
      display: none;
    }
  }
}

/deep/ .waterfull-item {
  padding-bottom: 0.7rem;
}

/deep/.coverBg {
  width: 100%;
  height: 0.7rem;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: 0;
}

/deep/.goodsInfo {
  position: absolute;
  bottom: -0.55rem;
  padding: 0.1rem;
}
/deep/ .el-tabs__item {
  width: 0.8rem;
  height: 0.32rem;
  line-height: 0.32rem;
  text-align: center;
  border-radius: 0.16rem;
  color: #999999;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0.1rem;
  &.is-active {
    background: #000000;
    color: #ffffff;
  }
}
/deep/.el-tabs__active-bar.is-top {
  display: none;
}
</style>
