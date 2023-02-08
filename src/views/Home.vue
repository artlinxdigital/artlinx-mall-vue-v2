<template>
  <div
      class="homeContainer pcContainer bgColor"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-immediate="false"
  >
    <PcPageHeader @search="searchList" ref="pcPageHeader"/>
    <div class="banners">
      <el-carousel :height="clientWidth > 600 ? '2.5rem' : '1.53rem'">
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
                font-size: 0.15rem;
                padding: 0.4rem 0 0 0.4rem;
                line-height: 1.5em;
              "
            >
              <span style="font-size: 0.2rem">Artlinx </span> <br/>Create your
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
        <div class="tabs customeTab wrapper" ref="wrapper">
          <div class="cont" ref="cont">
            <el-tabs v-model="activeSelection" @tab-click="handleClickTab">
              <el-tab-pane
                  v-for="item in selections"
                  :key="item.productCategoryId"
                  :label="item.categoryName"
                  :name="item.productCategoryId"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <div class="selectMenu" @click="show = !show">
            <i class="el-icon-s-operation"></i>
          </div>
        </div>
        <transition name="el-fade-in">
          <div class="sortTypes" v-show="show">
            <MSortIcon
                :isActive="mSortActive === item.sortKey"
                :isUp.sync="$data[item.sortKey]"
                :title="item.name"
                v-for="item in dropdownTypes"
                :key="item.sortKey"
                @click.native.stop="handleSortActiveType(item.sortKey)"
            />
          </div>
        </transition>
      </div>

      <Collections :listBg="'#ffffff'" :list.sync="mallCollectionList"/>
      <p v-if="loading" class="loading"><i class="el-icon-loading"></i></p>
      <p v-if="mallCollectionList.length > 0 && noMore" class="noMore">
        <el-divider
        ><span style="color: #597a6ba5"
        >There is a BOTTOM LINE for digital art，Artlinx 2022</span
        ></el-divider
        >
      </p>
      <EmptyData top="20%" v-if="mallCollectionList.length <= 0"/>
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
import Footer from "@/views/HomeFooter";
import PcPageHeader from "@/components/PcPageHeader";
import SelectTab from "@/components/SelectTab";
import MSortIcon from "@/components/MSortIcon";
import Dropdown from "@/components/Dropdown";
import EmptyData from "@/components/EmptyData";
import {InfiniteScroll} from "element-ui";
import {banners} from "@/mock";
import Collections from "./Collections";
import API from "@/service/index";
import MTipModal from "@/components/MTipModal";
import BScroll from "better-scroll";

export default {
  components: {
    Footer,
    PcPageHeader,
    SelectTab,
    MSortIcon,
    Collections,
    Dropdown,
    MTipModal,
    EmptyData,
  },
  data() {
    return {
      background: true,
      autoScroll: false,
      layout: "prev, pager, next",
      pageSize: 50,
      pageSizes: [10, 50, 100],
      banners: banners,
      selections: [],
      mSortActive: "0",
      activeSelection: "",
      dropdownType: "综合排序",
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
      show: false,
      isUpType: true,
      clientWidth: 750,
      account: "",
      time: "",
      price: "",
      favorite: "",
      collection: "",
      userStatus: 1,
      applyStatus: -1,
      tipVisible: false,
      content: "",
      confirmTxt: "",
      pageNum: 1,
      loading: false,
      noMore: false,
      mallCollectionList: [],
      keyword: "",
      total: 0,
      dragged: null,
      scroll: null,
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
    // 排序
    orderBy() {
      switch (this.mSortActive) {
        case "price":
          return `price ${this.price ? "asc" : "desc"}`;
        case "time":
          return `time ${this.time ? "asc" : "desc"}`;
        case "favorite":
          return `favorite ${this.favorite ? "asc" : "desc"}`;
        case "collection":
          return `collection ${this.collection ? "asc" : "desc"}`;
        default:
          return "time desc";
      }
    },
  },
  mounted() {
    this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth;
    });
    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer);
          this.verScroll();
        }
      }, 10);
    });
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
          console.log(res.data.data)
          this.maskContentData = res.data.data
        }
      })
    },
    // ...mapActions("wallet", ["getCurrentUser"]),
    //tab滚动
    verScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: false,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.scroll.refresh(); //如果dom结构发生改变调用该方法
        }
      });
    },

    // 铸造go back时设置选中排序条件
    initCondition() {
      const {tab, sort} = this.$route.query;
      if (tab) {
        this.activeSelection = tab;
      }
      if (sort) {
        this.mSortActive = "time";
        this.time = false;
      }
    },
    // 查询藏品分类列表
    categoryList() {
      API.categoryList().then((result) => {
        console.log("分类列表：" + JSON.stringify(result));
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

    // 加载藏品列表
    getMallCollectionList() {
      const walletAddress = window.localStorage.getItem("walletAddress");

      if (this.disabled) return;
      this.loading = true;
      this.$API
          .getMallCollectionList({
            loginId:
                walletAddress == "" ? 0 : window.localStorage.getItem("loginId"),
            pageNum: this.pageNum,
            pageSize: 50,
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
                //   ...this.mallCollectionList,
                //   ...goodsList,
                // ];
                if (this.autoScroll) {
                  this.$refs.page_bottom_coin.scrollIntoView({behavior: "smooth"})
                  this.autoScroll = false;
                }
                this.mallCollectionList = goodsList;
                this.noMore = this.mallCollectionList.length >= this.total;
                // this.pageNum = this.pageNum + 1;
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
      console.log("搜索商品关键词", keyword);
    },
    handleSortActiveType(sortKey) {
      if (this.mSortActive !== sortKey) {
        this.mSortActive = sortKey;
        const selectType = this.dropdownTypes.find(
            (item) => item.sortKey === sortKey
        );
        if (selectType) {
          this.time = false;
          this.price = false;
          this.favorite = false;
          this.collection = false;
          this[selectType.sortKey] = true;
        }
      }
      this.searchList(this.keyword);
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
.pcContainer {
  @media screen and (max-width: 800px) {
    min-height: 100vh;
    background-color: #ffffff;
  }
}

.homeContainer {
  position: relative;
  width: 100%;
  height: 100vh;
  // padding-bottom: 0.86rem;
  overflow-y: auto;
}

.home-footer {
  position: relative;
  //padding-top: 0.86rem;
}

.banners {
  width: 100%;
  position: relative;

  /deep/ .el-image,
  .imgBox {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
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
      width: 30%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: #111;
      border-radius: 4px;
      text-align: center;
      padding: 0.01rem;
      overflow: hidden;

      .title {
        font-size: 0.1rem;
        height: 0.21rem;
      }

      .num {
        font-size: 0.15rem;
        margin-bottom: 0.1rem;
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
  display: none;
}

.page_bottom_coin {
  padding: 0.2rem 0rem 0rem 0rem;
}

.selectionsBox {
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 96%;
  margin: 0rem auto 0.1rem;

  .tabs {
    width: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 0.15rem;

    .selectMenu {
      position: absolute;
      top: 0;
      right: 0;
      background: #ffffff;
      font-weight: bold;
      //background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1A1B33 20%, #1A1B33 100%);
      //background: -moz-linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1A1B33 20%, #1A1B33 100%);
      //background: -ms-linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1A1B33 20%, #1A1B33 100%);
      //background: -webkit-linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1A1B33 20%, #1A1B33 100%);
      //background: -o-linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #1A1B33 20%, #1A1B33 100%);
      width: 0.54rem;
      height: 0.32rem;
      line-height: 0.32rem;
      color: #000000;
      font-size: 0.2rem;
      z-index: 10;
      text-align: center;
    }

    /deep/ .el-tabs {
      width: 100%;
    }

    .cont {
      width: 7rem;
    }
  }

  .sortTypes {
    font-size: 0.14rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.29rem 0.15rem 0rem;
  }

  /deep/ .el-tabs__item {
    height: 0.32rem;
    line-height: 0.32rem;
    margin-right: 0.1rem;
    padding: 0 0.2rem !important;
    font-size: 0.14rem;
    color: #000000;
    border-radius: 0.2rem;
    background: rgba(255, 255, 255, 0.2);

    &.is-active {
      font-size: 0.14rem;
      background: #000000;
      color: #ffffff;
    }
  }
}

/deep/ .el-tabs__active-bar {
  display: none !important;
}

.el-dropdown-link {
  font-size: 0.22rem;
  color: #000000;
  cursor: pointer;
}

.btnMakeCreate {
  position: fixed;
  width: 1rem;
  height: 1rem;
  background: #2a513f url("../assets/images/icon_txt.png") no-repeat center;
  background-size: 0.58rem 0.28rem;
  box-shadow: 0px 0.07rem 0.08rem 0px rgba(47, 173, 195, 0.25);
  border-radius: 50%;
  right: 0.25rem;
  bottom: 30%;
  z-index: 101;
  touch-action: none;
  @media screen and (min-width: 800px) {
    display: none;
  }
}

/deep/ .el-tabs__nav-wrap.is-scrollable {
  padding: 0;
}

/deep/ .el-tabs__nav-prev,
/deep/ .el-tabs__nav-next {
  display: none;
}

/deep/ .waterfull-item {
  padding: 0 0.05rem;
}

/deep/ .goodsCard {
  padding: 0.1rem;
  background: rgba(255, 255, 255, 0.06);
  //border-radius: 0.16rem;
  margin-bottom: 0.1rem;
}

.el-pagination {
  right: 0;
}

.pagination_class {
  width: max-content;
  position: sticky;
  margin: 0px auto;
  padding-bottom: 20px;
}
</style>
