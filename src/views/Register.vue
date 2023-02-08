<template>
  <div class="loginContainer fWhite">
    <!--		<img class="mPage" src="../assets/images/bg@1x.png" />-->
    <div class="loginContent fWhite" style="margin-bottom: 40px;">
      <div class="pcPage fl">
        <div class="pcLogo"></div>
        <div class="text-login">
          <p>
            You are one step away to join the global serious art community,
            Artlinx, create your digital art assets for free, and enjoy the
            pleasure to buy and sell real art pieces online.
          </p>
          <br />
          <p>
            We only accept serious artists and collectors to develop the global
            digital art world. The cutting-edge technology makes it possible for
            your art works alive in the digital world with uniqueness and low
            costs.
          </p>
          <br />
          <p>
            All artists, institutions or individual collectors are most welcome
            to join our community, from time to time we will have offline event
            Artlinx Seminar and meet-up for our community.
          </p>
          <br />
        </div>

        <img
          src="../assets/images/Illustration.jpg"
          style="width: 100%;;height: auto;margin-bottom: 30px;"
        />
      </div>
      <div class="loginPannel fr" style="margin-top:40px">
        <div class="mLogo"></div>
        <h3 class="mPage">Global Digital Art Marketplace</h3>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Register" name="register">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="20"
            >
              <el-form-item label="Acccount" prop="account">
                <el-input
                  v-model.trim="ruleForm.account"
                  class="flex-grow"
                  placeholder="Enter your email address"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="Verification Code" prop="msgCode">
                <el-input
                  v-model.trim="ruleForm.msgCode"
                  placeholder="Enter the verification code"
                  maxlength="6"
                  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                >
                  <span
                    slot="suffix"
                    type="primary"
                    class="el-input__icon msgBtn"
                    :disabled="isDisabled"
                    @click="showVerityFn"
                    v-html="timeNum == 60 ? 'Send Code' : timeNum"
                  >
                    Get code</span
                  >
                </el-input>
              </el-form-item>
              <el-form-item label="Password" prop="pwd">
                <el-input
                  :type="pwdType"
                  v-model.trim="ruleForm.pwd"
                  class="withEye"
                  placeholder="Create password and memorise it firmly!"
                >
                  <i
                    slot="suffix"
                    class="iconfont"
                    :class="pwdType == 'text' ? 'icon-kejian' : 'icon-bukejian'"
                    @click="togglePwdType"
                  ></i>
                </el-input>
              </el-form-item>
              <el-form-item label="Confirm Password" prop="pwdConfirm">
                <el-input
                  :type="pwdConfirmType"
                  v-model.trim="ruleForm.pwdConfirm"
                  class="withEye"
                  placeholder="Confirm your login password"
                >
                  <i
                    slot="suffix"
                    class="iconfont"
                    :class="
                      pwdConfirmType == 'text' ? 'icon-kejian' : 'icon-bukejian'
                    "
                    @click="togglePwdConfirmType"
                  ></i>
                </el-input>
              </el-form-item>
              <el-form-item label="Referral Code" prop="otherCode">
                <el-input
                  :type="otherCodeType"
                  v-model.trim="ruleForm.otherCode"
                  placeholder="Referral Code (optional)"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <RegisterBtnRow @register="handleRegister" />
          </el-tab-pane>
          <div class="login-tip">
            <el-checkbox v-model="checked"
              >I agree to the
              <span class="link" @click="protocalVisible = true"
                >《Services Agreement》</span
              ></el-checkbox
            >
          </div>
        </el-tabs>
      </div>
      <div class="clear"></div>
    </div>
    <ServiceProtocol :visible.sync="protocalVisible" />
    <pcFooter />
    <mFooter />
    <MTipModal
      :visible.sync="tipVisible"
      title="Registration Successful"
      content="Please keep your password, otherwise you are responsible for the loss of assets, please note."
      cancelTxt="cancel"
      :isCancel="false"
      confirmTxt="confirm"
      @close="toCancel"
      @ok="toConfirm"
    />
    <!-- TODO:新增 提示 弹窗  -->
    <el-dialog
          title="Registration Successful"
          :visible.sync="dialogVisible"
          :width="clientWidth < 800 ? '85%' : '510px'" 
          :close-on-click-modal="false"
          :show-close="false" >
          <div style="margin-top:-15px;">
            <p>Your wallet address and private key have been generated in your local environment, Please keep it stored and secret properly!</p>
            <div class="infoLi ">  
            <div class="infoLiLt fb">Your wallet address(you can use in Metamask)</div>
            <div class="infoLiRt">
              <div class="infoLiRtL">
                <span class="address">{{ ruleForm.walletAddress | ellipsisAddress }}</span>
                <el-button type="primary" class="btnCopy" v-clipboard:copy="ruleForm.walletAddress" v-clipboard:success="onCopy">copy</el-button>
              </div>
            </div>
            </div>
            <div class="infoLi"> 
              <div class="infoLiLt fb"  >Private Key(Your Private Key,please keep it with cautions,lost it your asset will not be able to RECOVER!)</div>
              <div class="infoLiRt">
                <div class="infoLiRtL">
                  <span class="address" v-if="isPrivateKey">{{ privateKey | ellipsisAddress }}</span>
                  <span class="address" v-else>{{ privateKey | ellipsisPrivateKey }}</span>
                    <el-button   type="primary" class="btnCopy" @click="hidePrivateKey()"><i  class="iconfont" :class="!isPrivateKey? 'icon-kejian' : 'icon-bukejian'"></i></el-button>
                
                  <el-button v-if="isPrivateKey" type="primary" class="btnCopy ml0" v-clipboard:copy="privateKey" v-clipboard:success="onCopy">copy</el-button>
               </div>
				</div>
            </div>
            <el-checkbox v-model="registerCheck" class="mt10">
             <span style="white-space:pre-wrap"> I have copied the private key and saved it properly!</span>
            </el-checkbox>
          </div>
          <span slot="footer" class="dialog-footer"> 
            <el-button type="primary" :disabled="!registerCheck" @click="handleRegisterOk">sure</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
import pcFooter from '@/pcviews/HomeFooter'
import mFooter from '@/views/HomeFooter'
import RegisterBtnRow from '@/components/RegisterBtnRow'
import ServiceProtocol from '@/components/ServiceProtocol'
import MTipModal from '@/components/MTipModal'
import API from '@/service/index'
import Vue from 'vue';
import { checkEmail } from '@/utils/rules'
const sm3 = require('sm-crypto').sm3

export default {
  components: {
    pcFooter,
    mFooter,
    RegisterBtnRow,
    //			PcPageHeader,
    ServiceProtocol,
    MTipModal
  },
  	filters: {
      ellipsisAddress(value) {
        if(!value) return "";
        if(value.length > 25) {
        	return `${value.substring(0, 12)}......${value.substring(
          value.length - 12
        )}`;
        }
        return value;
      },
      ellipsisPrivateKey(value) {
        if(!value) return "";
        let str = '';
        for (let i = 0;i<value.length-1;i++){
          str=str+"*";
        } 
        return str.substr(1,40);
      },
		},
  data() {
    // 校验账号
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please enter your email address！'))
      } else {
        if (checkEmail(value)) {
          callback()
        } else {
          return callback(new Error('Please enter the correct email address！'))
        }
      }
    }
    return {
     
     isPrivateKey:false,
      isDisabled: false,
      timeNum: 60,
      privateKey: '',
      privateKeys: '',
      ruleForm: {
        account: '',
        msgCode: '',
        otherCode: '',
        pwd: '',
        pwdConfirm: '',
        walletAddress: '',
        privateKey: '',
        publicKey: '',
        sePass: '', 
      },
      rules: {
        account: [
          {
            required: true,
            validator: checkAccount,
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message:
              'Please create your login password and memorise it firmly!',
            trigger: 'blur'
          }
        ],
        pwdConfirm: [
          {
            required: true,
            message: 'Please reconfirm your login password',
            trigger: 'blur'
          }
        ],
        msgCode: [
          {
            required: true,
            message: 'Please enter the verification code in your email',
            trigger: 'blur'
          }
        ]
      },
      activeName: 'register',
      pwdType: 'password',
      pwdConfirmType: 'password',
      otherCodeType: 'text',
      protocalVisible: false,
      checked: false,
      tipVisible: false,
      clientWidth: 750,
      dialogVisible:false,
      registerCheck:false, // 注册 提示确认
    }
  },
  mounted() {this.getCurrentUser();
    this.$nextTick(() => {
      this.clientWidth = document.documentElement.clientWidth
    })
    // 推荐码
    var recommendCode = this.$route.query.recommendCode
    if (
      recommendCode !== null &&
      recommendCode !== '' &&
      recommendCode !== undefined
    ) {
      this.ruleForm.otherCode = recommendCode
    }
  },
  methods: {
    toCancel() {
      this.tipVisible = false
      this.$router.push({
        path: '/login'
      })
    },
    toConfirm() {
      this.tipVisible = false
      this.$router.push({
        path: '/login'
      })
    },
    togglePwdType() {
      this.pwdType = this.pwdType === 'text' ? 'password' : 'text'
    },
    togglePwdConfirmType() {
      this.pwdConfirmType = this.pwdConfirmType === 'text' ? 'password' : 'text'
    },
    toggleOtherCodeType() {
      this.otherCodeType = this.otherCodeType === 'text' ? 'password' : 'text'
    },
    showVerityFn() {
      const account = this.ruleForm.account
      if (!account) {
        this.common.notification(
          this,
          'Please Search items, collections, and accounts！',
          2
        )
        return
      }
      if (!checkEmail(account)) {
        this.common.notification(
          this,
          'Please enter the correct email address！',
          2
        )
        return
      } else {
        //检查手机号是否已注册
        this.checkAccountIsExist()
      }
    },
    //  检查账号是否已经存在
    checkAccountIsExist() {
      const account = this.ruleForm.account
      if (!account) {
        this.common.notification(
          this,
          'Please Search items, collections, and accounts！',
          3
        )
        return
      }
      if (!checkEmail(account)) {
        this.common.notification(
          this,
          'Please enter the correct email address！',
          3
        )
        return
      }
      API.checkAccountIsExist({
        account: account
      }).then((result) => {
        console.log('checkResult: ' + JSON.stringify(result))
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3)
          return
        } else {
          // 获取验证码
          this.getCode()
        }
      })
    },
    // 获取短信验证码
    getCode() {
      API.getCode({
        account: this.ruleForm.account
      }).then((result) => {
        console.log('msgResult: ' + JSON.stringify(result))
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3)
          return
        } else {
          this.common.notification(
            this,
            'Successfully sent, please check the verification code！',
            1
          )
          this.sendCodeShow = true
          this.isDisabled = true
          this.timer = setInterval(() => {
            this.timeNum--
            if (this.timeNum == 0) {
              this.isDisabled = false
              window.clearInterval(this.timer)
              this.timeNum = 60
            }
          }, 1000)
        }
      })
    },
    // 账号注册
    handleRegister() {
      if (!checkEmail(this.ruleForm.account)) {
        this.common.notification(
          this,
          'Please enter the correct email address！',
          2
        )
        return
      }
      if (this.ruleForm.pwd != this.ruleForm.pwdConfirm) {
        this.common.notification(
          this,
          'The escrow passwords entered before and after are inconsistent',
          2
        )
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.checked) {
            this.common.notification(
              this,
              'You have not checked the service agreement',
              2
            )
            return
          }
          const pwd = sm3(this.ruleForm.pwd)
          const generate = require('ethjs-account').generate
          // 生成区块链账号
          const account = generate(pwd)
          this.privateKey = account.privateKey.substring(
            2,
            account.publicKey.length
          )
          sessionStorage.setItem('personAccount', this.ruleForm.account)
          const publicKey = account.publicKey.substring(
            2,
            account.publicKey.length
          )
          this.ruleForm.publicKey = publicKey
          this.ruleForm.walletAddress = account.address
          const sePrivateKey = this.$sm4.encrypt_ecb(this.privateKey, pwd)
          this.ruleForm.privateKey = sePrivateKey
          const pwdPriKey = sm3(this.privateKey)
          const seHostPass = this.$sm4.encrypt_ecb(this.ruleForm.pwd, pwdPriKey)
          this.ruleForm.sePass = seHostPass
          console.log('this.ruleForm：' + JSON.stringify(this.ruleForm))
          API.register({
            account: this.ruleForm.account,
            walletAddress: this.ruleForm.walletAddress,
            publicKey: this.ruleForm.publicKey,
            encryptPrivateKey: this.ruleForm.privateKey,
            encryptPassword: this.ruleForm.sePass,
            msgCode: this.ruleForm.msgCode,
            otherCode: this.ruleForm.otherCode
          }).then((result) => {
            if (result.code !== 200) {
              this.common.notification(this, result.msg, 3)
              return
            }
            // this.common.notification(this, "注册成功.", 1);
            // 跳转到登录页面
            // this.$router.push({
            // 	path: '/login'
            // });
            this.dialogVisible=true
           // TODO: 需要验证一下 以下新增  2021-11-10 
            // if (this.clientWidth < 800) {
            //   this.tipVisible = true
            //   return
            // } else {
            //   this.$confirm(
            //     'Please keep your password, otherwise you are responsible for the loss of assets, please note.',
            //     'Registration Successful',
            //     {
            //       confirmButtonText: 'confirm',
            //       cancelButtonText: 'cancel',
            //       type: 'warning'
            //     }
            //   )
            //     .then(() => {
            //       this.$router.push({
            //         path: '/login'
            //       })
            //     })
            //     .catch(() => {
            //       this.$router.push({
            //         path: '/login'
            //       })
            //     })
            //   return
            // }
          })
        } else {
          return
        }
      })
    },
    // 密码登录接口
    loginByPwd() {
      API.loginByPwd({
        account: this.ruleForm.account
      }).then((result) => {
        // console.log("loginByPwd: " + JSON.stringify(result));
        if (result.code === 200) {
          sessionStorage.setItem('personAccount', this.ruleForm.account)
          localStorage.setItem('user', JSON.stringify(result.data))
          sessionStorage.setItem('enPass', sm3(this.ruleForm.pwd))
          this.privateKeys = result.data.encryptPrivateKey
          this.storagePrivateKey()
          // 跳转注册成功页面
          this.$router.push({
            path: '/login'
          })
        } else {
          this.common.notification(this, result.msg, 3)
        }
      })
    },
    // 存储私钥
    storagePrivateKey() {
      let privateKey = ''
      // 用SM4解密
      privateKey = this.forSM4Decrypt(this.privateKeys)
      if (privateKey && privateKey.length === 64) {
        sessionStorage.setItem('encryPri', this.privateKeys)
        // sessionStorage.setItem("privateKey", privateKey);
      } else {
        this.common.notification(this, 'Managed password error', 3)
      }
    },
    // sm4解密
    forSM4Decrypt(privateKeys) {
      const pwdOri = this.ruleForm.pwd
      const pwd = sm3(pwdOri)
      let privateKey = ''
      try {
        privateKey = this.sm4decrypt(privateKeys, pwd)
      } catch (e) {
        console.log(e)
      }
      if (privateKey) {
        this.common.notification(this, 'Connect successfully.', 1)
        return privateKey
      }
    },
    // sm4解密
    sm4decrypt(word, pwd) {
      const decrypt = this.$sm4.decrypt_ecb(word, pwd)
      return decrypt
    },
    /**  以下新增  2021-11-10 */
     hidePrivateKey(){
        this.isPrivateKey = !this.isPrivateKey
      },
      	onCopy() {
				this.$notify.success({
					title: "",
					message: "Copied success！",
				})
        // this.isPrivateKey = !this.isPrivateKey

			},
      handleRegisterOk(){
        this.dialogVisible=false
        this.$router.push({  path: '/login'  })
      }
  }
}
</script>

<style lang="less" scoped>
.text-login {
  margin-top: 20px;
}
.loginContainer {
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  //background: url("../assets/images/bg@2x.png") no-repeat;
  background: #ffffff;
  background-size: cover;
  @media (min-width: 801px) and (max-width: 1186px) {
    width: 1186px;
    overflow: scroll;
  }
  @media screen and (max-width: 800px) {
    background: none;
    height: auto;
    /deep/ img.mPage {
      z-index: -1;
      position: relative;
      display: block;
      width: 100%;
    }
    /deep/ .pcHeader {
      display: none;
    }
    /deep/.el-input__suffix {
      line-height: 0.4rem;
    }
  }
  /deep/ .loginContent {
    width: 1186px;
    margin: 50px auto 0;
    @media screen and (max-width: 800px) {
      width: 100%;
      margin: 0;
    }
    .pcPage {
      width: 540px;
      .pcLogo {
        width: 120px;
        height: 120px;
        background: url(../assets/images/logo_vertical.png) no-repeat;
        background-size: 120px auto;
      }
      h3 {
        text-align: left;
        font-size: 32px;
        margin: 54px 0 30px;
      }
      p {
        font-size: 16px;
        color: #313131;
      }
      img {
        //margin-top: -30px;
      }
    }
  }
  /deep/ .el-tabs {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.07) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 16px;
    border: 1px solid #444;
    padding: 40px 5%;
    @media screen and (max-width: 800px) {
      margin-top: 0.45rem;
      padding: 0.45rem 5%;
    }
  }
  /deep/ .el-tabs__item {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #ffffff;
    @media screen and (max-width: 800px) {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.18rem;
    }
    &.is-active {
      color: #000000;
    }
  }
  /deep/ .el-tabs__nav-wrap {
    width: 80px;
    margin: 0 auto;
    @media screen and (max-width: 800px) {
      width: 0.8rem;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 30px;
    @media screen and (max-width: 800px) {
      margin-bottom: 0.3rem;
    }
  }
  /deep/ .el-tabs__active-bar {
    height: 0.04rem;
  }
  /deep/ .el-input__inner {
    color: #000000;
    height: 40px;
    line-height: 40px;
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 8px;
    font-size: 14px;
    @media screen and (max-width: 800px) {
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.14rem;
    }
  }
  /*/deep/ .el-input__prefix {
			line-height: 0.63rem;
			left: 0.17rem;
			@media screen and (max-width: 800px) {
				line-height: 0.78rem;
				left: 0.25rem;
			}
		}*/
  /deep/.footer {
    background: #000000;
  }
}

.loginPannel {
  width: 540px;
  margin-top: 90px;
  /deep/ .el-form-item {
    margin-bottom: 15px;
  }
  @media screen and (max-width: 800px) {
    //position: absolute;
    width: 90%;
    margin-right: 5%;
    //top: 0.5rem;
    //left: 0;
    //right: 0;
    //margin: auto;
    /deep/ .el-form-item {
      margin-bottom: 0.25rem;
    }
  }
}

.msgBtn {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  border-left: 1px solid #cacaca;
  @media screen and (max-width: 800px) {
    border-left: none;
    height: 0.4rem;
    padding-left: 0.2rem;
    font-size: 0.14rem;
  }
}

.mLogo {
  display: none;
  @media screen and (max-width: 800px) {
    display: block;
    width: 1.2rem;
    height: 0.4rem;
    margin: 0 auto 0.3rem;
    background: url('../assets/images/logo_vertical.png') no-repeat center;
    background-size: 1.2rem 0.4rem;
  }
}

h3 {
  font-size: 0.24rem;
  text-align: center;
  font-weight: 400;
}

.login-tip {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #313131;
  @media screen and (max-width: 800px) {
    margin-top: 0.4rem;
    font-size: 0.12rem;
    text-align: center;
  }
  .link {
    font-size: 12px;
    color: #000000;
    cursor: pointer;
    @media screen and (max-width: 800px) {
      font-size: 0.12rem;
    }
  }
}
.mt10{margin-top:10px;}
.mb5{margin-bottom:5px;}
.ml0{margin-left:0!important}
.fb{font-weight: bold;}
	@fz14: 14px;
	@fz12: 12px;
	@radius8: 8px;
	@rtWidth: 100%;
.infoLi {
  margin-top: 10px;
  .infoLiLt {
    font-size: @fz14;
    line-height: 20px;
    margin-bottom:5px;
  }
  .infoLiRtL {
    font-size: @fz14;
    width: @rtWidth;
    //background: @bg;
    border: 1px solid #000000; 
    line-height: 40px;;
    height: 40px;;
    border-radius: @radius8;
    position: relative;
    display:flex;
    align-items: center;
    &.introduction {
      line-height: 22px;
      height: 130px;overflow-y:auto;
    }
  }
  .address{
    flex:1;
    display: inline-block;
    height:40px;
    line-height: 40px;
    overflow: hidden;
    padding-left:5px ;
  }
  .tip {
    color: #b0b0b0;
    font-size: @fz12;
    line-height: 40px;
  }
  .btnCopy {
    border: none;
    color: #000000;
    background: none;
    padding: 0 10px; 
    height: 40px;  
  }
}
.right40{
    right:40px!important;
  }
  /deep/ .el-checkbox__input{
      @media screen and (max-width: 800px) {
     vertical-align: 15px;;
    }
  }
 /deep/ .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover{
   color: #fff;
    background-color: #808080;
    border-color: #808080;
 }
</style>
