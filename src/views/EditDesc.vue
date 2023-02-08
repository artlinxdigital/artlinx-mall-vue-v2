<template>
  <div class="pageContainer">
    <MPageHeader title="修改introduction" />
    <div class="content">
      <el-form label-position="top" label-width="auto" :model="form">
        <el-form-item label="My profile">
          <el-input v-model.trim="form.desc" type="textarea"
  :rows="5" placeholder="It will show me what am I."></el-input>
        </el-form-item>
      </el-form>
      <div class="btnRow">
        <el-button type="primary" class="btnSave" @click="updateIntroduction" plain>save</el-button>
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
        desc: ''
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
            var introduction = result.data.introduction;
            if (introduction !== null && introduction !== '' && introduction !== undefined ) {
              this.form.desc = introduction;
            }
        });
    },
    // 编辑用户introduction
    updateIntroduction() {
      var desc = this.form.desc;
      if (!desc) {
        this.common.notification(this, "please enter my profile", 3);
        return;
      }
      API.updateIntroduction({
        certificationId: window.localStorage.getItem("loginId"),
        desc: desc
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
  /deep/ .el-textarea__inner {
    border: 0;
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
    @media screen and (max-width: 800px) {
      &:hover {
        color: #000000;
      }
    }
  }
}
</style>
