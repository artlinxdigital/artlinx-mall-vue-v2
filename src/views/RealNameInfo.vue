<template>
  <div class="pageContainer realNameInfo">
    <MPageHeader title="KYC" />
    <ul class="infoList">
      <li class="infoItem">
        <span class="infoItemLabel">Real Name</span>
        <span class="infoItemVal">{{realName}}</span>
      </li>
      <li class="infoItem">
        <span class="infoItemLabel">ID number</span>
        <span class="infoItemVal">{{number | ellipsisIdCard}}</span>
      </li>
      <li class="infoItem">
        <span class="infoItemLabel">Account</span>
        <span class="infoItemVal">{{mobile | ellipsisAccount}}</span>
      </li>
      <li class="infoItem">
        <span class="infoItemLabel">Face Recognition</span>
        <span class="infoItemVal">Verified</span>
      </li>
    </ul>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import API from "@/service/index";

export default {
  components: {
    MPageHeader
  },
  filters: {
    ellipsisIdCard(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 3)}********${value.substring(value.length - 4)}`;
        }
        return value;
    },
    ellipsisAccount(value) {
        if (!value) return "";
        if (value.length > 10) {
            return `${value.substring(0, 3)}****${value.substring(value.length - 4)}`;
        }
        return value;
    }
  },
  data() {
    return {
      realName: '',
      number: '',
      mobile: ''
    };
  },
  mounted() {this.getCurrentUser();
    // 用户信息
    this.getUserInfo();
  },
  methods: {
    // 查询用户信息
    getUserInfo() {
        API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") }).then(result => {
            if (result.code !== 200) {
              this.common.notification(this, "Data loading failure", 3);
              return;
            }
            // console.log("用户信息：" + JSON.stringify(result));
            this.realName = result.data.realName;
            this.number = result.data.number;
            this.mobile = result.data.mobile;
        });
    }
  }
}
</script>

<style lang="less" scoped>
.infoList {
  padding: 0 0.24rem;
}
.infoItem {
  display: flex;
  align-items: center;
  padding: 0.32rem 0;
  border-bottom: 1px solid #eee;
  .infoItemLabel {
    width: 1.2rem;
    margin-right: 0.54rem;
    font-size: 0.28rem;
    color: #333;
    font-weight: 500;
  }
  .infoItemVal {
    flex: 1;
    font-size: 0.28rem;
    color: #999;
  }
}
</style>
