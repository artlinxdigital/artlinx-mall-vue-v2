<template>
  <div class="pageContainer">
    <MPageHeader title="Change nickname" />
    <div class="content">
      <el-form label-position="top" label-width="auto" :model="form">
        <el-form-item label="User name">
          <el-input v-model.trim="form.name" placeholder="Please enter a nickname" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="btnRow">
        <el-button type="primary" class="btnSave" @click="updateNickName" plain>save</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MPageHeader from "@/components/MPageHeader";
import API from "@/service";

export default {
  components: {
    MPageHeader
  },
  data () {
    return {
      form: {
        name: ''
      }
    }
  },
  mounted() {this.getCurrentUser();
    // 查询用户信息
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
            var nickName = result.data.nickName;
            if (nickName !== null && nickName !== '' && nickName !== undefined ) {
                this.form.name = nickName;
            }
        });
    },
    // 编辑用户昵称
    updateNickName() {
      var nickName = this.form.name;
      if (!nickName) {
        this.common.notification(this, "Please enter nickname information", 3);
        return;
      }
      API.updateNickName({
        certificationId: window.localStorage.getItem("loginId"),
        nickName: nickName
      }).then(result => {
        if (result.code !== 200) {
          this.common.notification(this, "fail in keeping, Please wait for a moment！", 3);
          return;
        }
        this.common.notification(this, "Successful preservation！", 1);
        this.$router.push({
          path: '/edit-info'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  min-height: 100vh;
  padding: 0.33rem 0.3rem;
  background: #F9F9F9;
  /deep/ .el-input__inner {
    height: 0.9rem;
    border: 0;
    border-radius: 0.16rem;
  }
  /deep/ .el-form-item__label {
    padding-bottom: 0;
  }
}
.btnRow {
  margin-top: 0.9rem;
  .btnSave {
    width: 100%;
    background: #fff;
    border-radius: 0.2rem;
  }
}
</style>
