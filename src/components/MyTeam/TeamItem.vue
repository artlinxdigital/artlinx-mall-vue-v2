<template>
  <li class="teanMem">
    <div class="teamLt">
      <span class="indexNum">0{{ idx + 1 }}.</span>
      <div class="imgBox">
        <el-image class="coverImg" :src="avatarUrl" fit="cover"> </el-image>
      </div>
      <div class="teamMember">
        <span class="memeberName">{{ item.nickName | ellipsisAccount }}</span>
        <div class="memberLabel">
          <span class="labelName">{{ item.realName | ellipsisAccount }}</span>
          <span class="labelReal" v-if="item.isVerify == 1"
            >Have real name</span
          >
        </div>
        <span class="memDate">{{ item.createTime }}</span>
      </div>
    </div>
    <!-- <div class="teamRt">HK${{ item.tradeAmount }}</div> -->
  </li>
</template>

<script>
import API from "@/service/index";
export default {
  props: {
    item: Object,
    idx: Number,
  },
  filters: {
    ellipsisAccount(value) {
      if (!value) return "";
      if (value.length > 10) {
        return `${value.substring(0, 3)}****${value.substring(
          value.length - 4
        )}`;
      }
      return value;
    },
  },
  data() {
    return {
      avatarUrl: API.getDefaultAvatarUrl(),
    };
  },
  mounted() {
    this.getCurrentUser();
    var avatarUrl = this.item.avatarUrl;
    this.avatarUrl = avatarUrl
      ? API.getAvatarAccessPrefix() + avatarUrl
      : API.getDefaultAvatarUrl();
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.teanMem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.33rem 0;
  border-bottom: 1px solid #eaedef;
}
.teamLt {
  display: flex;
  align-items: center;
}
.imgBox {
  width: 0.6rem;
  height: 0.6rem;
  margin: 0 0.2rem;
  border-radius: 100%;
  .coverImg {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
.teamMember {
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
  .memeberName {
    margin-bottom: 0.1rem;
    font-size: 0.16rem;
  }
}
.memberLabel {
  display: flex;
  align-items: center;
  .labelName {
    font-size: 0.12rem;
  }
  .labelReal {
    margin-left: 0.1rem;
    padding: 0.04rem 0.06rem;
    font-size: 0.12rem;
    color: #0085ff;
    border: 1px solid #0085ff;
    border-radius: 0.08rem;
  }
  .labelRealN {
    margin-left: 0.1rem;
    padding: 0.04rem 0.06rem;
    font-size: 0.12rem;
    color: #c9c9c9;
    border: 1px solid #c9c9c9;
    border-radius: 0.08rem;
  }
}
.memDate {
  margin-top: 0.1rem;
  font-size: 0.14rem;
}
.indexNum {
  font-size: 0.16rem;
  font-weight: 500;
}
</style>
