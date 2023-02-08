<template>
  <div class="recomends">
    <h3 class="panelTitle">MORE</h3>
    <div class="recomendList" :class="{ empty: list.length <= 0 }">
      <EmptyBox title="No data" v-if="list.length <= 0" />
      <el-row :gutter="30">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
          v-for="item in list"
          :key="item.productId"
        >
          <router-link class="itemCard" :to="`/collection/${item.productId}`">
            <div class="itemImgBox" v-if="false">
              <el-image class="itemImg" :src="videoImg" fit="cover"></el-image>
            </div>
            <div class="itemImgBox" v-if="item.productType === 2">
              <el-image class="itemImg" :src="audioImg" fit="cover"></el-image>
            </div>
            <div class="itemImgBox" v-if="true">
              <el-image
                class="itemImg"
                :src="item.productImage"
                fit="cover"
                lazy
              >
                <div slot="placeholder">
                  <el-image :src="placeholderImg" fit="cover" lazy></el-image>
                </div>
                <div slot="error" class="image-slot">
                  <el-image
                    class="fillImg"
                    :src="errImg"
                    fit="contain"
                  ></el-image>
                </div>
              </el-image>
            </div>
            <span class="itemName">{{ item.productName }}</span>
            <div class="itemPrice">
              <i class="icMony">{{ coinMap[item.coinType] }}</i>
              <span class="price">{{
                item.price && item.price.toFixed(2)
              }}</span>
            </div>
            <div class="itemOthenInfo">
              <div class="itemAuthor">
                <!-- <div class="itemAuthorImg">
                  <el-image
                    class="fillImg"
                    :src="item.productCreatorAvatar | ellipsisAvatar"
                    fit="cover"
                    lazy
                  >
                    <div slot="placeholder">
                      <el-image :src="placeholderImg" fit="cover"></el-image>
                    </div>
                    <div slot="error" class="image-slot">
                      <el-image
                        class="fillImg"
                        :src="errImg"
                        fit="cover"
                      ></el-image>
                    </div>
                  </el-image>
                </div> -->
                <span class="itemAuthorName">{{
                  item.productAuthor
                }}</span>
              </div>
              <div class="itemLikeStar">
                <div class="star" :class="{ active: item.isCollection === 1 }">
                  <i class="iconfont icon-aixin"></i>
                  <span>{{ item.collectionCount }}</span>
                </div>
                <div class="like" :class="{ active: item.isFavorite === 1 }">
                  <i class="iconfont icon-dianzan"></i>
                  <span>{{ item.favoriteCount }}</span>
                </div>
              </div>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import EmptyBox from "@/components/EmptyBox";
import GoodsCard from "../../pcviews/GoodsCard";
import API from "@/service";
import { coinMap, coinDec } from "@/const/const";
export default {
  props: {},
  components: {
    EmptyBox,
    GoodsCard,
  },
  filters: {
    ellipsisNickName(value) {
      if (!value) return "";
      if (value.length > 4) {
        if (value.length > 8) {
          return `${value.substring(0, 4)}****${value.substring(
            value.length - 4
          )}`;
        }
        return `${value.substring(0, 2)}****${value.substring(
          value.length - 2
        )}`;
      }
      return value;
    },
    ellipsisAvatar(value) {
      if (!value) return API.getDefaultAvatarUrl();
      return API.getAvatarAccessPrefix() + value;
    },
  },
  data() {
    return {
      list: [],
      sameAuthorList: [],
      placeholderImg: require("@/assets/images/artlinx_loading.jpg"),
      errImg: require("@/assets/images/load_err.jpg"),
      videoImg: require("@/assets/images/newTheme/shipin@2x.jpg"),
      audioImg: require("@/assets/images/newTheme/yinpin@2x.jpg"),
      authorImg: require("@/assets/images/newTheme/author_avatar.jpeg"),
      coinMap: {},
    };
  },
  mounted() {
    this.getCurrentUser();
    this.coinMap = coinMap;
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
      // console.log("sameAuthor：", data);
      if (data !== null) {
        this.list = data.map((item) => {
          return {
            ...item,
            productImage: 'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + item.coverImage + '/public',
          };
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.recomends {
  padding-bottom: 1.55rem;
  @media screen and (max-width: 800px) {
    padding-bottom: 0.8rem;
  }
}
.recomendList {
  position: relative;
  min-height: 3rem;
  &.empty {
    display: flex;
    align-items: center;
    background: rgba(177, 181, 212, 0.01);
    border-radius: 0.04rem;
    @media screen and (max-width: 800px) {
      display: initial;
      background: none;
      border-radius: 0;
    }
  }
}
.panelTitle {
  margin-bottom: 0.41rem;
  font-size: 0.24rem;
  font-weight: 500;
  color: #000000;
  line-height: 0.36rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.24rem;
    font-size: 0.18rem;
  }
}
.itemCard {
  display: flex;
  flex-direction: column;
  padding: 0.16rem;
  margin-bottom: 0.23rem;
  background: rgba(177, 181, 212, 0.06);
  border-radius: 0.16rem;
}
.itemImg {
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  //border-radius: 0.16rem;
  background-color: #fff;
  @media screen and (max-width: 800px) {
    height: 3.55rem;
  }
}
.itemName {
  margin-top: 0.16rem;
  margin-bottom: 0.12rem;
  font-size: 0.18rem;
  color: #000000;
}
.itemPrice {
  margin-bottom: 0.2rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.16rem;
  }
  .icMony {
    margin-right: 0.08rem;
    font-size: 0.14rem;
    color: #707070;
    font-weight: 500;
  }
  .price {
    font-size: 0.18rem;
    color: #707070;
  }
}
.itemOthenInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999999;
}
.itemLikeStar {
  display: flex;
  align-items: center;
  font-size: 0.14rem;
  .star {
    margin-right: 0.18rem;
  }
  .star,
  .like {
    display: flex;
    align-items: center;
    span {
      font-size: 0.14rem;
    }
    &.active {
      color: #ef4848;
      .iconfont {
        color: red;
      }
    }
  }
  .iconfont {
    margin-right: 0.08rem;
  }
}
.itemAuthor {
  display: flex;
  align-items: center;
}
.itemAuthorImg {
  width: 0.32rem;
  height: 0.32rem;
  margin-right: 0.08rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: rgba(255, 255, 255, 0.08);
  color: #000000;
  .fillImg {
    border-radius: 100%;
  }
}
.itemAuthorName {
  font-size: 0.14rem;
}
.image-slot {
  height: 100%;
}
</style>
