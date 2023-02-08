<template>
  <div class="similarList">
    <EmptyData top="10%" v-if="list.length <= 0" />
    <router-link
      class="similarItem"
      v-for="item in list"
      :key="item.id"
      :to="`/collection/${item.id}`"
    >
      <!-- <div class="itemLt" v-if="item.productType === 3">
        <el-image class="itemImg" :src="videoImg" fit="cover"></el-image>
      </div> -->
      <div class="itemLt" v-if="item.productType === 2">
        <el-image class="itemImg" :src="audioImg" fit="cover"></el-image>
      </div>
      <div class="itemLt" v-if="true">
        <el-image class="itemImg" :src="item.img" fit="cover" lazy>
          <div slot="placeholder">
            <el-image :src="placeholderImg" fit="cover" lazy></el-image>
          </div>
        </el-image>
      </div>
      <div class="itemRt">
        <h4 class="itemName">{{ item.name }}</h4>
        <span class="subTip">Spot price</span>
        <div class="itemSubInfo">
          <span class="itemSubInfoPrice">
            <i>HK$</i>
            <span>{{ item.price.toFixed(2).split(".")[0] }}.</span>
            <span class="smNum">{{ item.price.toFixed(2).split(".")[1] }}</span>
          </span>
          <div class="likeStarNum">
            <span class="likeNum">Like{{ item.favoriteCount }}</span>
            <span class="starNum">collect{{ item.collectionCount }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import EmptyData from "@/components/EmptyData";
import API from "@/service/index";

export default {
  props: {},
  components: {
    EmptyData,
  },
  data() {
    return {
      list: [],
      sameAuthorList: [],
      placeholderImg: require("@/assets/images/artlinx_loading.jpg"),
      videoImg: require("@/assets/images/shipin@2x.png"),
      audioImg: require("@/assets/images/yinpin@2x.png"),
    };
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    // 跳转详情页
    linkToDetail(item) {
      console.log(item);
      this.$router.push({
        path: `/collection/${item.id}`,
      });
    },
    // 获取同author藏品
    getSameAuthorList(data) {
      // console.log("sameAuthor：" + JSON.stringify(data));
      if (data !== null) {
        this.list = [];
        for (let i = 0; i < data.length; i++) {
          this.list.push({
            id: data[i].productId,
            name: data[i].productName,
            price: data[i].price,
            favoriteCount: data[i].favoriteCount,
            collectionCount: data[i].collectionCount,
            img: 'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + data[i].coverImage + '/public',
            productType: data[i].productType,
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.similarList {
  padding-bottom: 0.3rem;
}
.similarItem {
  display: flex;
  // align-items: center;
  margin-bottom: 0.65rem;
  cursor: pointer;
  @media screen and (max-width: 800px) {
    padding-bottom: 0.28rem;
    margin-bottom: 0.27rem;
    border-bottom: 1px solid #f6f6f6;
    &:last-child {
      border-bottom: 0;
    }
  }
}
.itemLt {
  margin-right: 0.26rem;
}
.itemImg,
.itemLt {
  width: 1.8rem;
  height: 1.6rem;
  //border-radius: 0.16rem;
}
.itemRt {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.itemName {
  margin-bottom: 0.4rem;
  font-size: 0.26rem;
  color: #1a1a1a;
}
.subTip {
  margin-bottom: 0.11rem;
  font-size: 0.22rem;
  color: #999;
  @media screen and (min-width: 800px) {
    margin-bottom: 0.2rem;
  }
}
.itemSubInfo {
  display: flex;
  justify-content: space-between;
  font-size: 0.15rem;
}
.itemSubInfoPrice {
  color: #2fb1c0;
  i {
    font-size: 0.24rem;
  }
  span {
    font-size: 0.31rem;
  }
  .smNum {
    font-size: 0.22rem;
    @media screen and (max-width: 800px) {
      font-size: 0.22rem;
    }
  }
}
.likeStarNum {
  display: flex;
  align-items: center;
  font-size: 0.15rem;
  color: #666;
  .likeNum {
    margin-right: 0.63rem;
    @media screen and (max-width: 800px) {
      margin-right: 0.45rem;
    }
    &::before {
      content: "";
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      vertical-align: middle;
      margin-right: 0.08rem;
      background: url("../assets/images/icon_dianzan_d@2x.png") no-repeat center;
      background-size: 0.24rem 0.24rem;
    }
  }
  .starNum {
    &::before {
      content: "";
      display: inline-block;
      width: 0.24rem;
      height: 0.24rem;
      vertical-align: middle;
      margin-right: 0.08rem;
      background: url("../assets/images/icon_shoucang@2x.png") no-repeat center;
      background-size: 0.24rem 0.24rem;
    }
  }
}
</style>
