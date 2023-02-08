<template>
  <div class="goodsCard">
    <div class="cover" :style="initCardStyle(info)" @click="toDetail">
      <!-- src="../assets/images/newTheme/shipin@2x.jpg" -->
      <img
        v-lazy="'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + info.data.coverImage + '/public'"
        @load="$emit('load')"
        @error="handleLazyErr"
        :data-id="info.data.coverImage"
        v-if="info.data.productType === 3"
      />
      <img
        src="../assets/images/newTheme/yinpin@2x.jpg"
        @load="$emit('load')"
        v-if="info.data.productType === 2"
      />
      <img
        v-lazy="'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + info.data.coverImage + '/public'"
        @load="$emit('load')"
        @error="handleLazyErr"
        :data-id="info.data.coverImage"
        v-if="info.data.productType === 1"
      />

      <span class="typeLabel" v-if="info.data.productType === 3">video</span>
      <span class="typeLabel" v-if="info.data.productType === 2">audio</span>
      <div class="coverBg"></div>
      <div
        class="onSaleLabel"
        v-if="showOnSale && info.data.status != 0"
        @click="linkWithSaleParam(info.data.productFrom)"
      >
        Saleable
      </div>
    </div>
    <div class="goodsInfo">
      <p class="name" @click="toDetail">{{ info.data.productName }}</p>
      <div class="priceStars">
        <span class="price">
          <i class="iconMony">{{ coinMap[info.data.coinType] }}:</i
          >{{ info.data.price.toFixed(2).split(".")[0] }}.<span class="smNum">{{
            info.data.price.toFixed(2).split(".")[1]
          }}</span>
        </span>
        <!-- <span class="star">{{info.data.collectionCount || 0}}人收藏</span> -->
      </div>
      <div class="authorInfo">
        <div class="authorInfoLt" @click.prevent.stop="showAuthor(info.data)">
          <!-- <img class="userAvatar" :src="info.data.userAvatar" /> -->
          <!-- <img
            class="userAvatar"
            :src="'/prod-api' + info.data.productCreatorAvatar"
            v-if="info.data.productCreatorAvatar"
          />
          <img
            class="userAvatar"
            :src="productCreatorAvatar"
            v-if="!info.data.productCreatorAvatar"
          /> -->
          <span>{{ info.data.productAuthor }}</span>
        </div>
        <div class="bt-icons">
          <div class="star" :class="{ active: info.data.isCollection === 1 }">
            <i class="iconfont icon-aixin"></i>
            <span>{{ info.data.collectionCount }}</span>
          </div>
          <div
            class="like"
            :class="{ active: info.data.isFavorite === 1 }"
            @click="toggleLike"
          >
            <i class="iconfont icon-dianzan"></i>
            <span>{{ info.data.favoriteCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/service";
import { coinMap } from "@/const/const";
export default {
  props: {
    info: Object,
    showOnSale: Boolean,
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
  },
  data() {
    return {
      productCreatorAvatar: API.getDefaultAvatarUrl(),
      coinMap: {},
    };
  },
  mounted() {
    this.getCurrentUser();
    this.coinMap = coinMap;
  },
  methods: {/*img图片404错误方法*/
    handleLazyErr(){
      // event.remove()
      let img = event.target;
      // console.log("event:",img);
      let coverImage = img.attributes['data-id'].value;
      console.log(coverImage);
      img.onerror = null //防止一直跳动
      API.collectionU({ipfsHash: coverImage}).then(result => {
        // if (result.code !== 200) {
        //   this.common.notification(this, result.msg, 3);
        //   return "";
        // } else {
        return 'https://imagedelivery.net/SynVCJ8TRAd-vPjFeKYdCQ/' + coverImage + '/public';
        // }
      });
    },
    /** 初始化卡片样式 */
    initCardStyle(props) {
      if (this.isSetInitStyle) {
        return {
          width: `${props.data.itemWidth - 20}px`,
          height: "auto",
        };
      }
    },
    showAuthor(info) {
      this.$emit("showAuthor", info);
    },
    toDetail() {
      this.$router.push({
        path: `/collection/${this.info.data.productId}`,
      });
    },
    toggleLike() {
      console.log("Like", this.info.data.isFavorite);
    },
    linkWithSaleParam(productFrom) {
      this.$router.push({
        path: `/collection/${this.info.data.productId}?from=${productFrom}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.goodsCard {
  background: rgba(177, 181, 212, 0.06);
  //border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
  top: 0;
  &:hover {
    top: -2px;
  }
  .cover {
    position: relative;
    cursor: pointer;
    background: #f1f3f4;
    //border-radius: 16px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
    }
  }
}

.goodsInfo {
  padding: 20px 0 10px;
  .name {
    font-size: 18px;
    color: #000000;
    text-align: justify;
    line-height: 1;
    cursor: pointer;
  }
}

.priceStars {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .price {
    display: flex;
    align-items: baseline;
    font-size: 20px;
    color: #000000;
    .smNum {
      font-size: 20px;
    }
  }
  .iconMony {
    font-size: 14px;
    font-weight: bold;
  }
}

.authorInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.32rem;
  .authorInfoLt {
    display: flex;
    align-items: center;
    color: #000000;
    span {
      font-size: 14px;
    }
  }
  .userAvatar {
    width: 32px;
    height: 32px;
    margin-right: 0.1rem;
    border-radius: 100%;
  }
  .bt-icons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .like,
  .star {
    margin-left: 0.2rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #707070;
    span {
      font-size: 14px;
    }
    .iconfont {
      margin-right: 0.05rem;
      font-size: 14px;
    }
    &.active {
      color: #ff3d3d;
      .iconfont {
        color: #ff3d3d;
      }
    }
  }
}

.typeLabel {
  position: absolute;
  width: 0.64rem;
  height: 0.32rem;
  line-height: 0.32rem;
  background: #ffffff;
  border-radius: 0.08rem;
  font-size: 0.2rem;
  color: #1a1a1a;
  text-align: center;
  right: 0.11rem;
  bottom: 0.11rem;
  z-index: 2;
}

.onSaleLabel {
  position: absolute;
  width: 2rem;
  height: 0.4rem;
  line-height: 0.4rem;
  transform: rotate(-45deg);
  background: rgba(0, 0, 0, 0.8);
  font-size: 0.16rem;
  color: #ffffff;
  text-align: center;
  left: -0.65rem;
  top: 0.1rem;
}
</style>
