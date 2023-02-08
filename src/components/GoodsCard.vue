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

      <div
        class="onSaleLabel"
        v-if="
          showOnSale && info.data.productFrom && info.data.productFrom === 2
        "
        @click="linkWithSaleParam(info.data.productFrom)"
      >
        Can be on
      </div>
    </div>
    <div class="goodsInfo">
      <p class="name" @click="toDetail">{{ info.data.productName }}</p>
      <div class="priceStars">
        <span class="price">
          <i class="iconMony">HK$</i
          >{{ info.data.price.toFixed(2).split(".")[0] }}.<span class="smNum">{{
            info.data.price.toFixed(2).split(".")[1]
          }}</span>
        </span>
      </div>
      <div class="authorInfo">
        <div class="authorInfoLt" @click.prevent.stop="showAuthor(info.data)">
          <img
            class="userAvatar"
            :src="'/prod-api' + info.data.productCreatorAvatar"
            v-if="info.data.productCreatorAvatar"
          />
          <img
            class="userAvatar"
            :src="productCreatorAvatar"
            v-if="!info.data.productCreatorAvatar"
          />
          <span>{{ info.data.productCreatorNickName | ellipsisNickName }}</span>
        </div>
        <div class="collectGroup">
          <div class="collect">
            <i class="iconfont icon-aixin"></i
            ><span class="star">{{ info.data.collectionCount || 0 }}</span>
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
    };
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
  background: #fff;
  //border-radius: 0.16rem;
  overflow: hidden;
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
    border-radius: 0.16rem;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
    }
  }
}
.goodsInfo {
  position: relative;
  z-index: 1;
  padding: 0.1rem 0.1rem 0.17rem;
  color: #000000;
  .name {
    font-size: 0.18rem;
    text-align: justify;
    line-height: 0.25rem;
    cursor: pointer;
    color: #000000;
  }
}
.priceStars {
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
  .price {
    display: flex;
    align-items: baseline;
    font-size: 0.16rem;
    color: #000000;
  }
  .iconMony {
    font-size: 0.14rem;
  }
  .star {
    margin-left: 0.21rem;
    font-size: 0.2rem;
    color: #999999;
  }
}
.authorInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
  .authorInfoLt {
    display: flex;
    align-items: center;
    font-size: 0.22rem;
    color: #000000;
  }
  .userAvatar {
    width: 0.32rem;
    height: 0.32rem;
    margin-right: 0.12rem;
    border-radius: 100%;
  }
  .collectGroup {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.3rem;
    color: #ffffff;
    .collect {
      margin-right: 0.25rem;
    }
    .collect,
    .like {
      line-height: 1;
      .icon-aixin,
      .icon-dianzan {
        margin-right: 0.1rem;
        color: #ffffff;
        font-size: 0.14rem;
      }
      .collect .active,
      .like .active {
        color: #ef4848;
        .icon-aixin,
        .icon-dianzan {
          color: #ef4848;
        }
      }
    }
  }
}
.typeLabel {
  position: absolute;
  width: 0.4rem;
  height: 0.2rem;
  line-height: 0.2rem;
  background: #ffffff;
  border-radius: 0.08rem;
  font-size: 0.12rem;
  color: #1a1a1a;
  text-align: center;
  right: 0.11rem;
  bottom: 0.11rem;
  z-index: 2;
}
.onSaleLabel {
  position: absolute;
  width: 2rem;
  height: 0.5rem;
  line-height: 0.5rem;
  transform: rotate(-45deg);
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.24rem;
  color: #000000;
  text-align: center;
  left: -0.5rem;
  top: 0.2rem;
}
.smNum {
  font-size: 0.16rem;
}
</style>
