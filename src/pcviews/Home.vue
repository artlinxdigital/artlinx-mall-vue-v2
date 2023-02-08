<template>
  <div
      class="homeContainer pcContainer"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="20"
      :infinite-scroll-immediate="false"
  >
    <PcPageHeader @search="searchList" ref="pcPageHeader"/>

    <div class="banners">
      <el-carousel :height="'450px'">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="imgBox" style="position: relative">
            <el-image :src="item.img" fit="cover"></el-image>
            <div
                style="
                background: rgba(0, 0, 0, 0.3);
                color: rgba(255, 255, 255, 0.5);
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                font-size: 18px;
                padding: 60px 80px;
                line-height: 1.5em;
              "
            >
              <span style="font-size: 28px">Artlinx </span> <br/>Create your
              digital art assets for free <br/>Buy and sell real art works
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="banner-mask-content">
        <div
            class="content-item"
            v-for="(lable, value) in maskContent"
            :key="value"
        >
          <div class="num" :title="maskContentData[value]">{{ maskContentData[value] }}</div>
          <div class="title">{{ lable }}</div>
        </div>
      </div>
    </div>
    <div class="page_bottom_coin" ref="page_bottom_coin">
      <div class="selectionsBox">
        <div class="tabs customeTab pcPage">
          <el-tabs v-model="activeSelection" @tab-click="handleClickTab">
            <el-tab-pane
                v-for="item in selections"
                :key="item.productCategoryId"
                :label="item.categoryName"
                :name="item.productCategoryId"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <div class="otherSelect">
          <Dropdown :dropdownTypes="dropdownTypes" @select="handleSelectType"/>
          <SortIcon
              :isUp.sync="isUpType"
              @click.native.stop="handleSortActiveType"
          />
        </div>

        <!-- <div class="otherSelect"> -->
        <!--<MSortIcon :isActive="mSortActive === item.sortKey" :isUp.sync="$data[item.sortKey]" :title="item.name" v-for="item in dropdownTypes" :key="item.sortKey" @click.native.stop="handleSortActiveType(item.sortKey)" />-->
        <!-- <Dropdown :dropdownTypes="dropdownTypes" @select="handleSelectType" /> -->
        <!--<SortIcon :isUp.sync="isUpType" @click.native.stop="handleSortActiveType" />-->
        <!-- </div> -->
        <div class="clear"></div>
      </div>
      <Collections listBg="#ffffff" :list.sync="mallCollectionList"/>
      <p v-if="loading" class="loading"><i class="el-icon-loading"></i></p>
      <p v-if="mallCollectionList.length > 0 && noMore" class="noMore">
        <el-divider
        ><span style="color: #597a6ba5"
        >There is a BOTTOM LINE for digital art，Artlinx 2022</span
        ></el-divider
        >
      </p>
      <div style="padding: 1rem 0 1.6rem" v-if="mallCollectionList.length <= 0">
        <EmptyData top="0%"/>
      </div>
      <div class="pagination_class">
        <el-pagination
            :background="background"
            :current-page.sync="pageNum"
            :page-size.sync="pageSize"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="home-footer">
      <Footer/>
    </div>
  </div>
</template>

<script>
import PcPageHeader from "@/components/PcPageHeader";
import SelectTab from "@/components/SelectTab";
import SortIcon from "@/components/SortIcon";
import MSortIcon from "@/components/MSortIcon";
import Dropdown from "@/components/Dropdown";
import EmptyData from "@/components/EmptyData";
import Footer from "@/pcviews/HomeFooter";
import {InfiniteScroll} from "element-ui";
import {banners} from "@/mock";
import Collections from "./Collections";
import API from "@/service/index";

export default {
  components: {
    PcPageHeader,
    SelectTab,
    SortIcon,
    MSortIcon,
    Collections,
    Dropdown,
    EmptyData,
    Footer,
  },
  metaInfo: {
    title: "Artlinx",
    meta: [
      {charset: "utf-8"},
      {
        name: "viewport",
        content:
            "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no",
      },
      {
        name: "keyWords",
        content:
            "Digital art,Free Minting NFT for recognized artist,Serious Digital Art,Digital Artist", //变量或字符串
      },
      {
        name: "description",
        content:
            "Artlinx-Global Digital Art Marketplace,Digital Art Value Enhancer",
      },
    ],
  },
  data() {
    return {
      autoScroll: false,
      layout: "total, sizes, prev, pager, next",
      banners: banners,
      pageSize: 50,
      pageSizes: [10, 50, 100],
      selections: [],
      mSortActive: "0",
      activeSelection: "",
      dropdownType: "",
      dropdownTypes: [
        {
          name: "Price",
          type: "1",
          sortKey: "price",
        },
        {
          name: "Latest",
          type: "2",
          sortKey: "time",
        },
        {
          name: "Like",
          type: "3",
          sortKey: "favorite",
        },
        {
          name: "Favourite",
          type: "4",
          sortKey: "collection",
        },
      ],
      isUpType: true,
      account: "",
      time: "",
      price: "",
      background: true,
      favorite: "",
      collection: "",
      orderBy: "",
      userStatus: 1,
      applyStatus: -1,
      pageNum: 1,
      loading: false,
      noMore: false,
      mallCollectionList: [],
      keyword: "",
      total: 0,
      dragged: null,
      maskContent: {
        totalArtworks: 'Total Artworks',
        newArtPiecesOfToday: 'New Art pieces today',
        // totalMarketValue: 'Total Market Value',
      },
      maskContentData: {
        totalArtworks: '0',
        newArtPiecesOfToday: '0',
        // totalMarketValue: '0',
      }
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  watch: {
    "$store.state.wallet.walletConnected": {
      handler(newName, oldName) {
        // console.log("newName:", newName);
        // console.log("oldName:", oldName);
        if (newName) {
          // 钱包连接成功后刷新数据
          const keyword = this.$route.params.keyword;
          if (keyword) {
            this.keyword = keyword;
            this.$refs.pcPageHeader.fillSearch(this.keyword);
          }
          this.initCondition();
          this.categoryList();
          this.getUserInfo();
          this.getMallCollectionList();
          this.getBannerList();
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true,
    },
  },
  mounted() {
    this.getCurrentUser();
    // 搜索关键字
    const keyword = this.$route.params.keyword;
    if (keyword) {
      this.keyword = keyword;
      this.$refs.pcPageHeader.fillSearch(this.keyword);
    }
    this.initCondition();
    this.categoryList();
    this.getUserInfo();
    this.getMallCollectionList();
    this.getBannerList();
    this.getBannerCardData();
  },
  methods: {

    handleSizeChange(val) {
      // this.$emit('pagination', { page: this.currentPage, limit: val })
      this.autoScroll = true;
      this.getMallCollectionList();

    },
    handleCurrentChange(val) {
      // this.$emit('pagination', { page: val, limit: this.pageSize })
      this.autoScroll = true;
      this.getMallCollectionList();

    },
    // 查询首页card色块信息
    getBannerCardData() {
      API.getCardData().then(res => {
        if (res.code == 200) {
          this.maskContentData = res.data.data
        }
      })
    },
    // ...mapActions("wallet", ["getCurrentUser"]),
    handleSelectType(type) {
      const eqTypeObj = this.dropdownTypes.find((item) => item.type === type);
      if (eqTypeObj) {
        this.dropdownType = eqTypeObj.sortKey;
        this.handleSortActiveType();
      }
    },
    handleSortActiveType() {
      this.orderBy = `${this.dropdownType || "time"} ${
          this.isUpType ? "asc" : "desc"
      }`;
      this.searchList(this.keyword);
    },
    // 铸造go back时设置选中排序条件
    initCondition() {
      const {tab, sort} = this.$route.query;
      if (tab) {
        this.activeSelection = tab;
      }
      if (sort) {
        this.dropdownType = "time";
        this.isUpType = false;
        this.orderBy = "time desc";
      }
    },
    // 查询藏品分类列表
    categoryList() {
      API.categoryList().then((result) => {
        if (result.code == 200) {
          this.selections = result.data;
        }
      });
    },
    // 查询藏品分类列表
    getBannerList() {
      API.getBannerList().then((result) => {
        // console.log("轮播图列表：" + JSON.stringify(result));
        if (result.code == 200 && result.data != null) {
          // this.banners = result.data;
          if (result.data.length > 0) {
            this.banners = [];
            for (let i = 0; i < result.data.length; i++) {
              this.banners.push({
                id: result.data[i].bannerId,
                img: result.data[i].imageUrl,
              });
            }
          }
        }
      });
    },
    // 查询用户信息
    getUserInfo() {
      const walletAddress = window.localStorage.getItem("walletAddress");
      if (
          !walletAddress ||
          walletAddress == "" ||
          window.localStorage.getItem("loginId") == ""
      ) {
        this.account = "";
        return;
      }
      this.account = walletAddress;
      API.getUserInfo({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          console.log("查询用户信息失败");
          return;
        }
        if (result.data.status === 1) {
          this.account = result.data.realName;
        } else {
          this.account = result.data.mobile;
        }
        this.userStatus = result.data.status;
        this.applyStatus = result.data.applyStatus;
      });
    },

    // 去实名或者去申请成为铸造者
    toConfirm() {
      if (this.userStatus !== 1) {
        this.$router.push({
          path: "/realname",
        });
        return;
      }
      if (this.applyStatus !== 1) {
        this.$router.push({
          path: "/personal",
        });
        return;
      }
    },
    // 加载藏品列表
    getMallCollectionList() {
      if (this.disabled) return;
      this.loading = true;
      const walletAddress = window.localStorage.getItem("walletAddress");

      this.$API
          .getMallCollectionList({
            loginId:
                walletAddress == "" ? 0 : window.localStorage.getItem("loginId"),
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            productCategoryId: this.activeSelection,
            orderBy: this.orderBy,
            keyword: this.keyword || "",
          })
          .then((result) => {
            if (result.code !== 200) {
              this.common.notification(this, "Data loading failure", 3);
              this.loading = false;
              this.noMore = true;
              return;
            }
            if (result.data !== null) {
              this.total = result.data.totalCount;
              if (!this.noMore) {
                const goodsList = result.data.list;
                // this.mallCollectionList = [
                // 	...this.mallCollectionList,
                // 	...goodsList
                // ];
                if (this.autoScroll) {
                  this.$refs.page_bottom_coin.scrollIntoView({behavior: "smooth"})
                  this.autoScroll = false;
                }
                this.mallCollectionList = goodsList;
                this.noMore = this.mallCollectionList.length >= this.total;
              }
            }
            this.loading = false;
          });
    },
    searchList(keyword) {
      this.pageNum = 1;
      this.mallCollectionList = [];
      this.keyword = keyword;
      this.noMore = false;
      this.getMallCollectionList();
    },
    handleClickTab(tab, event) {
      this.pageNum = 1;
      this.mallCollectionList = [];
      this.noMore = false;
      this.getMallCollectionList();
    },
  },
  directives: {
    "infinite-scroll": InfiniteScroll,
  },
};
</script>

<style lang="less" scoped>
.homeContainer {
  position: relative;
  width: 100%;
  height: 100vh;
  // padding-bottom: 0.86rem;
  overflow-x: hidden;
  overflow-y: auto;
}

//.home-footer {
// position: relative;
// padding-top: 0.86rem;
//}

/deep/ .priceStars .price {
  font-size: 16px;

  .smNum {
    font-size: 16px;
  }
}

.banners {
  width: 100%;
  position: relative;

  /deep/ .el-carousel__indicators--horizontal {
  }

  /deep/ .el-carousel__indicator.is-active button {
    background: #000000;
    opacity: 1;
    color: #fff;
  }

  /deep/ .el-image {
    width: 100%;
    height: 450px;
  }

  /deep/ .el-carousel__button {
    background: #eeeeee;
    opacity: 0.5;
  }

  .banner-mask-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    // pointer-events: none;
    padding: 0 10%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;

    .content-item {
      // flex: 1;
      margin-right: 20px;
      background-color: rgba(255, 255, 255, .6);
      width: 280px;
      height: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #111;
      border-radius: 4px;
      text-align: center;
      padding: 10px;
      overflow: hidden;

      .title {
        font-size: 20px;
      }

      .num {
        font-size: 45px;
        margin-bottom: 10px;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.otherSelect {
  float: right;
  font-size: 16px;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  height: 40px;
  line-height: 38px;
  width: 180px;
  display: flex;
  justify-content: space-around;
  text-align: center;

  /deep/ .el-dropdown-link {
    font-size: 16px;
  }
}

.page_bottom_coin {
  padding: 60px 0px 30px 0px;
}

.selectionsBox {
  align-items: center;
  justify-content: space-between;
  width: 1186px;
  margin: 0px auto 26px;

  /deep/ .el-tabs__item {
    font-size: 16px;
    color: #000000;
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 20px;
    height: 40px;
    line-height: 40px;
    padding: 0 30px !important;
    margin-right: 20px;

    &.is-active {
      background: #000000;
      opacity: 1;
      color: #fff;
    }
  }

  .tabs {
    width: 1000px;
    float: left;

    /deep/ .el-tabs {
      width: 100%;
    }
  }

  .sortTypes {
    display: none;
  }

  /deep/ .el-tabs__active-bar {
    display: none;
  }
}

.noMore {
  display: flex;
  justify-content: center;
}

.el-divider--horizontal {
  width: 1186px;
}

.el-pagination {
  right: 0;
  position: absolute;


}

.pagination_class {
  width: 1186px;
  position: sticky;
  margin: 0px auto;
  padding-bottom: 20px;
}
</style>
