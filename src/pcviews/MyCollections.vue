<template>
  <div
    class="myCollections"
    v-infinite-scroll="getMyCollecttionList"
    :infinite-scroll-disabled="disabled"
  >
    <div class="pcPage">
      <PersonalCenterLayout activeKey="3-1">
        <div class="pageContainer myCollection">
          <div class="pcHead">
            <span class="pcHead">My favorites</span>
          </div>
          <Collections listBg="fff" :list.sync="list" />
          <p v-if="loading" class="loading"><i class="el-icon-loading"></i></p>
          <p v-if="list.length > 0 && noMore" class="noMore">
            <el-divider
              >There is a BOTTOM LINE for digital art，Artlinx 2022</el-divider
            >
          </p>
          <EmptyData top="25%" v-if="list.length <= 0" />
        </div>
      </PersonalCenterLayout>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll } from "element-ui";
import PersonalCenterLayout from "@/components/PersonalCenterLayout";
import MPageHeader from "@/components/MPageHeader";
//import Dropdown from "@/components/Dropdown";
import EmptyData from "@/components/EmptyData";
import Collections from "./Collections";
import API from "@/service/index";

export default {
  components: {
    MPageHeader,
    Collections,
    //  Dropdown,
    EmptyData,
    PersonalCenterLayout,
  },
  data() {
    return {
      loading: false,
      noMore: false,
      pageNum: 1,
      total: 0,
      list: [],
      orderBy: "time desc",
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  mounted() {this.getCurrentUser();},
  methods: {
    // 查询我的收藏列表
    getMyCollecttionList() {
      if (this.disabled) return;
      this.loading = true;
      API.myCollectionOpeList({
        certificationId: window.localStorage.getItem("loginId"),
        opeType: 2,
        orderBy: this.orderBy,
        pageNum: this.pageNum,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(
            this,
            "Data loading failure,Please wait for a moment！",
            3
          );
          this.noMore = true;
          this.loading = false;
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
          this.loading = false;
        }
      });
    },
  },
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
};
</script>

<style lang="less" scoped>
.myCollections {
  min-height: 100vh;
  overflow-y: auto;
  /deep/ .el-dropdown-link {
    @media screen and (min-width: 800px) {
      font-size: 0.16rem;
    }
  }
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
      margin-top: 0.15rem;
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
    }
    .authorInfo .userAvatar {
      width: 24px;
      height: 24px;
    }
  }
}

.personContent {
  width: 800px;
}

.myCollection {
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
