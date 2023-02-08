<template>
  <div class="accountValidate">
    <div class="head">
      <span>authentication</span>
      <i class="el-icon-circle-close iconClose" @click="$emit('close')"></i>
    </div>
    <p class="tip">
      For the security of your account, please authenticate.The verification code will be sent to your mobile phone, please check.
    </p>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="validateAccountForm">
      <el-form-item label="" prop="msgCode">
        <el-input v-model="ruleForm.msgCode" placeholder="Please enter the dynamic code">
          <div slot="suffix" class="getCodeBtn">
            <el-button type="text">get code</el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="isAuth">
        <el-checkbox v-model="ruleForm.checked">Set it to a trusted device</el-checkbox>
      </el-form-item>
    </el-form>
    <div class="btnRow">
      <el-button type="info" class="btnCancel" @click="$emit('close')">cancel</el-button>
      <el-button type="primary" class="btnConfirm">confirm</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        msgCode: "",
        checked: false,
      },
      rules: {
        msgCode: [{ required: true, message: "Please enter the dynamic code", trigger: "blur" }],
      },
    };
  },
};
</script>

<style lang="less" scoped>
.accountValidate {
  position: absolute;
  width: 5.41rem;
  height: 5.39rem;
  top: 33%;
  right: 26%;
  background: #fff;
  border-radius: 0.2rem;
  box-shadow: -0.02rem 0 0.27rem 0rem rgba(212, 212, 212, 0.34);
  z-index: 2;
  @media screen and (max-width: 800px) {
    width: 6rem;
    height: 7rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  /deep/ .el-form-item {
    margin-bottom: 0.28rem;
    .el-checkbox__label {
      color: #A1A1A1;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #2fbec0;
    }
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 1.5rem;
  }
  .head {
    height: 0.83rem;
    line-height: 0.83rem;
    background: #eeeeee;
    text-align: center;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    span {
      font-size: 0.3rem;
      color: #666;
    }
  }
  .iconClose {
    position: absolute;
    font-size: 0.3rem;
    color: #8f8f8f;
    top: 0.28rem;
    right: 0.26rem;
  }
  .tip {
    margin: 0.49rem 0.39rem 0.36rem 0.41rem;
    font-size: 0.22rem;
    color: #666;
    font-weight: 500;
    line-height: 0.48rem;
  }
}
.validateAccountForm {
  margin: 0 0.3rem 0 0.4rem;
}
.getCodeBtn {
  padding-left: 0.25rem;
  &::before {
    position: absolute;
    display: inline-block;
    content: '';
    width: 1px;
    height: 0.3rem;
    margin: auto 0;
    background: #cacaca;
    left: 0;
    top: 0;
    bottom: 0;
  }
}
.btnRow {
  display: flex;
  align-items: center;
  justify-content: center;
  .btnCancel, .btnConfirm {
    width: 1.8rem;
  }
  .btnCancel {
    margin-right: 0.4rem;
  }
  .btnConfirm {

  }
}
</style>
