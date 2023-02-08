<template>
  <div class="pageContainer addBankCard">
    <div class="ruleForm">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="1.25rem"
        label-position="top"
        size="small"
      >
        <div class="formGroup">
          <el-form-item label="Account Name" prop="accountName">
            <el-input
              v-model="form.accountName"
              placeholder="Please enter the account name"
            ></el-input>
          </el-form-item>
          <el-form-item label="Countries or Location" prop="country">
            <div class="inputBox">
              <el-select
                v-model="form.country"
                placeholder="Please select the countries or location"
                style="width: 100%;"
              >
                <el-option label="China CN" value="China CN"></el-option>
                <el-option label="Canada CA" value="Canada CA"></el-option>
                <el-option
                  label="Hong Kong, China HK"
                  value="Hong Kong, China HK"
                ></el-option>
                <el-option
                  label="Singapore SG"
                  value="Singapore SG"
                ></el-option>
                <el-option
                  label="United Kingdom GB"
                  value="United Kingdom GB"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="Bank Name" prop="bankName">
            <el-input
              v-model="form.bankName"
              placeholder="Please enter the bank name"
            ></el-input>
          </el-form-item>
          <el-form-item label="Account Number" prop="accountNumber">
            <el-input
              v-model.trim="form.accountNumber"
              placeholder="Please enter the account number"
            ></el-input>
          </el-form-item>
          <el-form-item label="Account Type" prop="accountType">
            <div class="inputBox">
              <el-select
                v-model="form.accountType"
                placeholder="Please select the account type"
                style="width: 100%;"
              >
                <el-option label="Multi-currency Account" :value="1">
                </el-option>
                <el-option label="Single Currency Account" :value="2">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="Bank Account Currency" prop="accountCurrency">
            <div class="inputBox">
              <el-select
                v-model="form.accountCurrency"
                placeholder="Please select the account currency"
                style="width: 100%;"
              >
                <el-option label="USD" value="USD"> </el-option>
                <el-option label="GBP" value="GBP"> </el-option>
                <el-option label="HKD" value="HKD"> </el-option>
                <el-option label="CAD" value="CAD"> </el-option>
                <el-option label="RMB" value="RMB"> </el-option>
                <el-option label="SGD" value="SGD"> </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="Bank swift code" prop="bankSwiftCode">
            <el-input
              v-model.trim="form.bankSwiftCode"
              placeholder="Please enter the bank swift code"
            ></el-input>
          </el-form-item>
          <el-form-item label="Local bank code" prop="localBankCode">
            <el-input
              v-model.trim="form.localBankCode"
              placeholder="Please enter the local bank code"
            ></el-input>
          </el-form-item>
          <el-form-item label="Contact address" required="">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="" prop="contactAddress">
                  <el-input
                    v-model="form.contactAddress"
                    placeholder="Please enter the country/region"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="position: relative">
                <el-form-item label="" prop="city">
                  <el-input
                    v-model="form.city"
                    placeholder="Please enter the city"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="position: relative">
                <span style="position: absolute;left:20px;top:0"></span>
                <el-form-item label="" prop="street">
                  <el-input
                    v-model="form.street"
                    placeholder="Please enter the street, house number"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <!-- <div class="formGroup">
					<el-form-item label="E-mail" prop="email">
						<el-input v-model.trim="form.email" placeholder="Please enter email address!"></el-input>
					</el-form-item>
					<el-form-item label="verification code" prop="msgCode" class="codeItem">
						<el-input v-model.trim="form.msgCode" placeholder="Please enter the verification code" maxlength="6" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
							<el-button slot="suffix" size="mini" type="primary" :disabled="isDisabled" @click="getCode" v-html="timeNum == 60 ? 'Please input the verification code in your email' : `${timeNum}s`" class="el-input__icon iconBtnSendCode">Please input the verification code in your email</el-button>
						</el-input>
					</el-form-item>
				</div> -->
      </el-form>
      <div class="btnRow">
        <el-button type="primary" round class="btnConfirm" @click="addBank">{{
          buttonTitle
        }}</el-button>
        <el-button class="btnConfirm" round @click="$router.go(0)"
          >cancel</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/service/index'
import { checkEmail } from '@/utils/rules'
export default {
  data() {
    return {
      form: {
        accountName: '',
        country: '',
        bankName: '',
        accountNumber: '',
        accountType: '',
        bankSwiftCode: '',
        localBankCode: '',
        contactAddress: '',
        accountCurrency: '',
        city: '',
        street: ''
        // email: "",
        // msgCode: "",
      },
      rules: {
        accountName: [
          {
            required: true,
            message: 'Please enter the account name',
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true,
            message: 'Please select the countries or location',
            trigger: 'blur'
          }
        ],
        bankName: [
          {
            required: true,
            message: 'Please enter the bank name',
            trigger: 'blur'
          }
        ],
        accountNumber: [
          {
            required: true,
            message: 'Please enter the account number',
            trigger: 'blur'
          }
        ],
        accountType: [
          {
            required: true,
            message: 'Please select the account type',
            trigger: 'blur'
          }
        ],
        accountCurrency: [
          {
            required: true,
            message: 'Please select the account currency',
            trigger: 'blur'
          }
        ],
        bankSwiftCode: [
          {
            required: true,
            message: 'Please enter the bank swift code',
            trigger: 'blur'
          }
        ],
        contactAddress: [
          {
            required: true,
            message: 'Please enter the country',
            trigger: 'blur'
          }
        ],
        city: [
          {
            required: true,
            message: 'Please enter the city',
            trigger: 'blur'
          }
        ],
        street: [
          {
            required: true,
            message: 'Please enter the street, house number',
            trigger: 'blur'
          }
        ]
      },
      selectBank: '',
      dialogVisible: false,
      bankList: [],
      isDisabled: false,
      timeNum: 60,
      buttonTitle: 'add'
    }
  },
  mounted() {this.getCurrentUser();
    this.getCertificationBank()
  },
  methods: {
    // 查询用户银行卡信息
    getCertificationBank() {
      API.getCertificationBank({
        certificationId: window.localStorage.getItem("loginId")
      }).then((result) => {
        console.log('银行卡信息：' + JSON.stringify(result))

        if (result.data !== null && result.data.length > 0) {
          this.form.accountName = result.data[0].accountName
          this.form.country = result.data[0].country
          this.form.bankName = result.data[0].bankName
          this.form.accountNumber = result.data[0].accountNumber
          this.form.accountType = result.data[0].accountType
          this.form.bankSwiftCode = result.data[0].bankSwiftCode
          this.form.localBankCode = result.data[0].localBankCode
          this.form.contactAddress = result.data[0].contactAddress
          this.form.accountCurrency = result.data[0].accountCurrency
          this.form.city = result.data[0].city
          this.form.street = result.data[0].street
          this.buttonTitle = 'update'
        } else {
          API.getUserInfo({
            certificationId: window.localStorage.getItem("loginId")
          }).then((result) => {
            if (result.code == 200 && result.data != null) {
              this.form.accountName = result.data.realName;
            }
          });
        }
      })
    },
    // 获取短信验证码
    getCode() {
      var email = this.form.email
      if (!email) {
        this.common.notification(this, 'Please enter email address!', 3)
        return
      } else {
        if (!checkEmail(email)) {
          this.common.notification(
            this,
            'Please enter the correct email address!',
            3
          )
          return
        }
      }
      API.getCode({
        account: email
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3)
          return
        } else {
          this.common.notification(
            this,
            'Successfully sent, please check the verification code！',
            1
          )
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
    // 添加bank card
    addBank() {
      // TODO:修改为form表单提交，需要检查是否正确？？？ 2021-11-06
      // // open an account
      // var accountName = this.form.accountName
      // if (!accountName) {
      //   this.common.notification(this, 'Please enter the account name！', 2)
      //   return
      // }
      // // 国家/地区
      // var country = this.form.country
      // if (!country) {
      //   this.common.notification(
      //     this,
      //     'Please select the countries or location！',
      //     2
      //   )
      //   return
      // }
      // // Bank Name
      // var bankName = this.form.bankName
      // if (!bankName) {
      //   this.common.notification(this, 'Please enter the bank name！', 2)
      //   return
      // }
      // // Bank Name
      // var accountNumber = this.form.accountNumber
      // if (!accountNumber) {
      //   this.common.notification(this, 'Please enter the account number！', 2)
      //   return
      // }
      // // Account Type
      // var accountType = this.form.accountType
      // if (!accountType) {
      //   this.common.notification(this, 'Please select the account type！', 2)
      //   return
      // }
      // // Account Currency
      // var accountCurrency = this.form.accountCurrency
      // if (!accountCurrency) {
      //   this.common.notification(
      //     this,
      //     'Please select the account currency！',
      //     2
      //   )
      //   return
      // }
      // // City
      // var city = this.form.city
      // if (!city) {
      //   this.common.notification(this, 'Please enter the city！', 2)
      //   return
      // }
      // // Street
      // var street = this.form.street
      // if (!street) {
      //   this.common.notification(this, 'Please enter the street！', 2)
      //   return
      // }
      // 邮箱地址
      // var email = this.form.email;
      // if(!email) {
      // 	this.common.notification(this, "Please enter email address!", 2);
      // 	return;
      // } else {
      // 	if(!checkEmail(email)) {
      // 		this.common.notification(this, "Please enter the correct email address!", 2);
      // 		return;
      // 	}
      // }
      // // 验证码
      // var msgCode = this.form.msgCode;
      // if(!msgCode) {
      // 	this.common.notification(this, "Please enter the verification code！", 2);
      // 	return;
      // }
      const refForm = this.$refs.form
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = {
            certificationId: window.localStorage.getItem("loginId"),
            // email: email,
            accountName: this.form.accountName,
            country: this.form.country,
            bankName: this.form.bankName,
            accountNumber: this.form.accountNumber,
            accountType: this.form.accountType,
            bankSwiftCode: this.form.bankSwiftCode,
            localBankCode: this.form.localBankCode,
            contactAddress: this.form.contactAddress,
            accountCurrency: this.form.accountCurrency,
            city: this.form.city,
            street: this.form.street
            // msgCode: msgCode,
          }
          if (this.buttonTitle == 'add') {
            API.addCertificationBank(param).then((result) => {
              console.log(
                'Add bank information result：' + JSON.stringify(result)
              )
              if (result.code !== 200) {
                this.common.notification(this, 'fail to add', 3)
                console.log('Description Failed to add the bank information')
                return
              }
              this.common.notification(this, 'successfully added', 1)
              this.$router.go(0)
            })
          } else {
            API.updateCertificationBank(param).then((result) => {
              console.log(
                'Update bank information result：' + JSON.stringify(result)
              )
              if (result.code !== 200) {
                this.common.notification(this, 'fail to add', 3)
                console.log('Description Failed to update the bank information')
                return
              }
              this.common.notification(this, 'successfully updated', 1)
              this.$router.go(0)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bg(@file, @width, @height) {
  width: @width;
  height: @height;
  background: url('@{file}') no-repeat;
  background-size: 100% 100%;
}

/deep/ input.el-input__inner {
  background: #ffffff;
  width: 100%;
  color: #000000;
  //box-shadow: 0px 2px 8px 0px rgba(22, 21, 54, 0.5);
  border: 1px solid #000000;
  border-radius: 0.08rem;
  line-height: 0.4rem;
  height: 0.4rem;
}

.bankTip {
  margin: 0.33rem 0.23rem 0.2rem;
  font-size: 0.22rem;
  font-weight: 500;
  @media screen and (min-width: 800px) {
    display: none;
  }
}

.formGroup {
  margin-bottom: 0.23rem;
  @media screen and (min-width: 800px) {
    padding: 0;
  }
  /deep/ .el-form-item {
  }
}

.btnRow {
  text-align: center;
  .btnConfirm {
    margin: 0 0.1rem;
  }
}

.cardLi {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  &::before {
    content: '';
    width: 0.25rem;
    height: 0.25rem;
    margin-right: 0.05rem;
  }
  &.gs {
    &::before {
      .bg(
        '../assets/images/bank/zhongguogongshangyinhang@2x.png',
        0.25rem,
        0.25rem
      );
    }
  }
  &.js {
    &::before {
      .bg(
        '../assets/images/bank/zhongguojiansheyinhang@2x.png',
        0.25rem,
        0.25rem
      );
    }
  }
  &.zgyh {
    &::before {
      .bg('../assets/images/bank/zhongguoyinhang@2x.png', 0.25rem, 0.25rem);
    }
  }
  &.zgyzcxyh {
    &::before {
      .bg(
        '../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png',
        0.25rem,
        0.25rem
      );
    }
  }
  &.nyyh {
    &::before {
      .bg('../assets/images/bank/nongyeyinhang@2x.png', 0.25rem, 0.25rem);
    }
  }
  &.jtyh {
    &::before {
      .bg('../assets/images/bank/jiaotongyinhang@2x.png', 0.25rem, 0.25rem);
    }
  }
  &.zsyh {
    &::before {
      .bg('../assets/images/bank/zhaoshangyinhang@2x.png', 0.25rem, 0.25rem);
    }
  }
  &.pfyh {
    &::before {
      .bg('../assets/images/bank/pufayinhang@2x.png', 0.25rem, 0.25rem);
    }
  }
  &.payh {
    &::before {
      .bg('../assets/images/bank/zhongguopingan@2x.png', 0.25rem, 0.25rem);
    }
  }
}

.ruleForm {
  width: 100%;
  margin: 0 auto;
  /deep/ .el-input--small .iconBtnSendCode {
    width: 100px;
    background: none;
    color: #4b89fb;
    border: none;
  }
  /deep/.el-input__suffix-inner {
    line-height: 0.4rem;
  }
}
</style>
