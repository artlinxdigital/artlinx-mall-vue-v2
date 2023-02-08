<template>
  <div class="listContainer" :style="{ background: listBg }">
    <div class="listContent">
      <div>
        <slot></slot>
        <Waterfall
          ref="waterfall"
          :list="list"
          :gutter="2"
          :width="240"
          :breakpoints="waterfallConfig.breakpoints"
          :animationEffect="waterfallConfig.effect"
          :animationDuration="`${waterfallConfig.duration}s`"
          :animationDelay="`${waterfallConfig.delay}s`"
          :backgroundColor="listBg"
        >
          <template slot="item" slot-scope="props">
            <GoodsCard
              :info="props"
              @load="$refs.waterfall.refresh"
              @showAuthor="showAuthor"
              :showOnSale="showOnSale"
            />
          </template>
        </Waterfall>
      </div>
      <!-- <p v-if="loading" class="loading"><i class="el-icon-loading"></i></p>
      <p v-if="noMore" class="noMore">There is a BOTTOM LINE for digital art，Artlinx 2022</p> -->
    </div>
    <el-dialog
      title=""
      :visible.sync="authorVisible"
      width="80%"
      :before-close="handleClose"
      :show-close="false"
      :destroy-on-close="true"
      class="emptyDialog"
    >
      <AuthorInfo :info="selectAuthorInfo" @close="handleClose" />
    </el-dialog>
  </div>
</template>
<script>
import GoodsCard from "./CollectionsGoodsCard";
import Waterfall from "vue-waterfall-plugin";
import AuthorInfo from "@/components/AuthorInfo";
import API from "@/service/index";

const waterfallConfig = {
  breakpoints: {
    1200: {
      //当屏幕宽度小于等于1200
      rowPerView: 3,
    },
    800: {
      //当屏幕宽度小于等于800
      rowPerView: 2,
    },
    500: {
      //当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  effect: "fadeIn",
  duration: 1,
  delay: 0.2,
};

export default {
  props: {
    listBg: {
      type: String,
      require: false,
      default: "#eee",
    },
    list: [Array],
    showOnSale: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  components: {
    GoodsCard,
    Waterfall,
    AuthorInfo,
  },
  data() {
    return {
      waterfallConfig,
      loading: false,
      authorVisible: false,
      selectAuthorInfo: {},
      mallCollectionList: [],
    };
  },
  methods: {
    // 我的收藏列表
    getMyCollecttionList(data) {
      this.list = [];
      if (data !== null) {
        this.list = data;
      }
    },
    handleClose() {
      this.authorVisible = false;
      this.selectAuthorInfo = {};
    },
    showAuthor(info) {
      // 查询藏品author信息
      API.getUserInfo({
        certificationId: info.createId,
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          return;
        }
        if (result.data !== null) {
          this.selectAuthorInfo = result.data;
          this.selectAuthorInfo.productAuthor = info.productAuthor;
          this.selectAuthorInfo.productAuthorDesc = info.productAuthorDesc;
          this.authorVisible = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.listContainer {
  .listContent {
    width: 98%;
    margin: 0 auto;
    @media screen and (min-width: 800px) {
      padding: 0 20%;
    }
  }
}
</style>
