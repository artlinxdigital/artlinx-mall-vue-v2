<template>
  <section class="author">
    <h3 class="panelTitle">Minter</h3>
    <div class="authorWrap">
      <div class="authorImg">
        <el-image class="fillImg" :src="'/prod-api' + authorInfo.productCreatorAvatar" fit="cover" lazy v-if="authorInfo.productCreatorAvatar">
          <div slot="error" class="image-slot" style="height: 100%;">
            <el-image
              class="fillImg"
              :src="errImg"
              fit="cover"
            ></el-image>
          </div>
        </el-image>
        <el-image class="fillImg" :src="productCreatorAvatar" fit="cover" lazy v-if="!authorInfo.productCreatorAvatar">
          <div slot="error" class="image-slot" style="height: 100%;">
            <el-image
              class="fillImg"
              :src="errImg"
              fit="cover"
            ></el-image>
          </div>
        </el-image>
      </div>
      <span class="authorName">{{ authorInfo.productCreatorNickName }}</span>
    </div>
    <div class="authorDesc scrollbar" :class="{empty: !authorInfo.productCreatorIntro}">
      <p v-if="authorInfo.productCreatorIntro">{{ authorInfo.productCreatorIntro }}</p>
      <EmptyBox title="no profile" :showIcon="false" v-else />
    </div>
    <h3 class="panelTitle" style="margin-top: 10px;">Artist</h3>
    <div class="authorWrap">
      <span class="authorName">{{ authorInfo.productAuthor }}</span>
    </div>
    <div class="authorDesc scrollbar" :class="{empty: !authorInfo.productAuthorDesc}">
      <p v-if="authorInfo.productAuthorDesc">{{ authorInfo.productAuthorDesc }}</p>
      <EmptyBox title="no profile" :showIcon="false" v-else />
    </div>
  </section>
</template>

<script>
import EmptyBox from "@/components/EmptyBox";
import API from "@/service";

export default {
  props: {
    authorInfo: Object,
  },
  components: {
    EmptyBox,
  },
  filters: {
    ellipsisNickName(value) {
        if (!value) return "";
        if ( value.length > 4) {
            if (value.length > 8) {
              return `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
            }
            return `${value.substring(0, 2)}****${value.substring(value.length - 2)}`;
        }
        return value;
    }
  },
  data() {
    return {
      productCreatorAvatar: API.getDefaultAvatarUrl(),
      errImg: require("@/assets/images/load_err.jpg"),
    }
  },
}
</script>

<style lang="less" scoped>
.author {
  margin-top: 0.65rem;
  @media screen and (max-width: 800px) {
    margin-top: 0;
  }
}
.panelTitle {
  margin-bottom: 0.32rem;
  font-size: 0.24rem;
  font-weight: 500;
  color: #000000;
  line-height: 0.36rem;
  @media screen and (max-width: 800px) {
    margin-bottom: 0.24rem;
    font-size: 0.18rem;
  }
}
.authorWrap {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.16rem;
}
.authorName {
  //margin-left: 0.16rem;
  color: #000000;
  @media screen and (max-width: 800px) {
    margin-left: 0;
    font-size: 0.16rem;
  }
}
.authorImg {
  width: 0.48rem;
  height: 0.48rem;
  margin-right: 0.16rem;
  border-radius: 100%;
  @media screen and (max-width: 800px) {
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.08rem;
  }
  .fillImg {
    border-radius: 100%;
  }
}
.authorDesc {
  height: 0.99rem;
  overflow-y: auto;
  font-size: 0.14rem;
  font-weight: 400;
  color: #505050;
  line-height: 0.22rem;
  &.empty {
    background: rgba(177, 181, 212, 0.01);
    border-radius: 0.04rem;
    @media screen and (max-width: 800px) {
      background: none;
      border-radius: 0;
    }
  }
  @media screen and (max-width: 800px) {
    height: auto;
    // min-height: 0.89rem;
    overflow: hidden;
  }
}
</style>
