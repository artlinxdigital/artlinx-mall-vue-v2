<template>
  <li class="teanMem">
    <span class="indexNum flex-grow">0{{ idx + 1 }}.</span>
    <div class="imgBox flex-grow">
      <el-image class="coverImg" :src="avatarUrl" fit="cover"> </el-image>
    </div>
    <span class="memeberName flex-grow">{{
      item.nickName | ellipsisAccount
    }}</span>
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
  padding: 5px 0;
  border-bottom: 1px solid #eaedef;
}
.imgBox {
  width: 15%;
  text-align: center;
  .coverImg {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }
}
.indexNum {
  width: 33%;
  text-align: center;
}
.memeberName {
  width: 15%;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
.memberLabel {
  width: 30%;
  text-align: center;
  span {
    font-size: 14px;
    font-weight: 500;
  }
  .labelReal {
    padding: 1px 12px;
    margin-left: 16px;
    border: 1px solid #000000;
    border-radius: 11px;
    font-size: 12px;
    color: #000000;
  }
  .labelRealN {
    padding: 1px 12px;
    margin-left: 16px;
    border: 1px solid #c6c6c6;
    border-radius: 11px;
    font-size: 12px;
    color: #c6c6c6;
  }
}
.amount {
  width: 15%;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
.time {
  width: 15%;
  font-size: 14px;
  text-align: center;
}
</style>
