<template>
  <div
    class="pageContainer owner"
    v-infinite-scroll="myNftList"
    :infinite-scroll-disabled="disabled"
  >
    <PersonalCenterLayout activeKey="3-2">
      <div class="myNftPc">
        <div class="pcHead">My items</div>
        <div class="nftCondition">
          <el-tabs v-model="activeSelection" @tab-click="handleClickTab">
            <el-tab-pane
              v-for="item in selections"
              :key="item.productCategoryId"
              :label="item.categoryName"
              :name="item.productCategoryId"
            ></el-tab-pane>
          </el-tabs>
          <!--<Dropdown @select="handleSelectType" :dropdownTypes="dropdownTypes" />-->
        </div>
        <Collections
          listBg="none"
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
        <EmptyData top="15%" v-if="list.length <= 0" />
      </div>
    </PersonalCenterLayout>
  </div>
</template>

<script>
import { InfiniteScroll } from "element-ui";
import MPageHeader from "@/components/MPageHeader";
import EmptyData from "@/components/EmptyData";
import SelectTab from "@/components/SelectTab";
import PersonalCenterLayout from "@/components/PersonalCenterLayout";
import Collections from "./Collections";

export default {
  components: {
    MPageHeader,
    Collections,
    EmptyData,
    SelectTab,
    PersonalCenterLayout,
  },
  data() {
    return {
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
  /deep/ .typeLabel {
    width: 0.45rem;
    height: 0.28rem;
    line-height: 0.28rem;
    font-size: 0.14rem;
  }
  /deep/ .goodsInfo {
    .name {
      font-size: 14px;
      padding-left: 10px;
    }
    .priceStars {
      margin-top: 10px;
    }
    .price {
      padding-left: 10px;
      font-size: 20px;
      .iconMony {
        font-size: 12px;
      }
      .smNum {
        font-size: 12px;
      }
    }
    .authorInfo {
      margin-top: 15px;
      .star span,
      .like span {
        font-size: 12px;
      }
    }
    .authorInfo .userAvatar {
      width: 24px;
      height: 24px;
    }
  }
  /deep/ .el-tabs__item {
    min-width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 16px;
    padding: 0 15px !important;
    color: #000000;
    text-align: center;
    border: 1px solid #000000;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 10px;
    &.is-active {
      background: #000000;
      color: #ffffff;
    }
  }
}
/deep/.el-tabs__active-bar.is-top {
  display: none;
}
.nftCondition {
  margin-bottom: 20px;
  @media screen and (max-width: 800px) {
  }
  /deep/ .el-tabs__nav-wrap::after {
    @media screen and (min-width: 800px) {
      height: 0;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0;
  }
}

.myNftPc {
  min-height: 100vh;
  /deep/ .listContent {
    padding: 0;
    width: 800px;
  }
}

.pcHead {
  font-size: 24px;
  margin-bottom: 40px;
}

/deep/ .waterfull-item {
  width: 245px !important;
  padding-bottom: 50px;
  .goodsCard {
    padding: 0;
    position: relative;
  }
  .goodsInfo {
    position: absolute;
    bottom: -45px;
    width: 100%;
  }
}

/deep/ .coverBg {
  width: 100%;
  height: 70px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: 0;
}
</style>
