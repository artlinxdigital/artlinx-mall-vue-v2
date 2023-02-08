<template>
  <div class="userCenter">
    <PersonalCenterLayout activeKey="1-2">
      <div class="pcPageCont">
        <h5 class="partTitle">KYC</h5>

        <div class="pageContainer authSuccess" v-if="isAuthFail">
          <div class="failIco"></div>
          <p class="successTxt">Authentication failure！</p>
          <div class="subTitle">
            <p>Your authentication failed, please re-authenticate.</p>
            <p>failure reasons：{{ auditContent }}</p>
          </div>
        </div>
        <div class="pageContainer authSuccess" v-if="isAuthAudit">
          <div class="auditIco"></div>
          <p class="successTxt">Under authentication...</p>
          <div class="subTitle">
            <p>
              Please be patient while your certification application is being
              reviewed by the administrator...
            </p>
          </div>
        </div>
        <!-- 第一步 -->
        <template v-if="activeStep === 1">
          <el-radio-group
            v-model="certificationType"
            size="medium"
            class="certificationTypeRadio"
            @change="changeCertificationType"
          >
            <el-radio-button :label="1">Personal</el-radio-button>
            <el-radio-button :label="2">Institution</el-radio-button>
          </el-radio-group>
          <!-- 个人  -->
          <el-form
            label-position="top"
            label-width="80px"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="form"
            v-show="certificationType === 1"
          >
            <el-form-item label="Real Name" prop="realName">
              <div class="inputBox">
                <el-input
                  class="grayInput"
                  placeholder="Please enter your name on your id card"
                  v-model="ruleForm.realName"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <!-- 新增 国家 2020-10-22 -->
            <el-form-item label="Country" prop="country">
              <div class="inputBox">
                <el-select
                  v-model="ruleForm.country"
                  placeholder="Please select the country"
                >
                  <el-option label="China" value="China"></el-option>
                  <el-option label="Other" value="Other"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="ID Type" prop="certType">
              <div class="inputBox">
                <el-select
                  v-model="ruleForm.certType"
                  placeholder="Please select the id type"
                >
                  <el-option label="ID Card" :value="1">ID Card</el-option>
                  <el-option label="Passport" :value="2">Passport</el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="ID number" prop="number">
              <div class="inputBox">
                <el-input
                  class="grayInput"
                  placeholder="Please enter your ID number"
                  v-model.trim="ruleForm.number"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="Identity photos" prop="cardNumPhoto">
              <div class="inputBox">
                <el-upload
                  action="#"
                  accept="image/*"
                  list-type="picture-card"
                  :file-list="fileList"
                  :limit="1"
                  :on-change="
                    (file, fileList) => handleChange(file, fileList, 1)
                  "
                  :auto-upload="false"
                  :class="[
                    fileList.length >= 1 ? 'hideUpload' : '',
                    'realNameUpload',
                  ]"
                >
                  <i
                    slot="default"
                    class="el-icon-plus"
                    v-if="!personImageUrl"
                  ></i>
                  <div slot="file" slot-scope="{ file }" v-if="!personImageUrl">
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                    <img class="avatar" :src="file.url" />
                    <i
                      class="el-icon-error iconRemove"
                      @click="handleRemove(file)"
                    ></i>
                  </div>
                  <img
                    v-if="personImageUrl"
                    class="avatar"
                    :src="personImageUrl"
                  />
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item prop="checkbox" class="checkBox" v-if="isShowConfirm">
              <el-checkbox v-model="ruleForm.checkbox" label="" name=""
                >I confirm the information I submit are all genuine and I
                understand the liability of by providing false
                information.</el-checkbox
              >
            </el-form-item>
          </el-form>
          <!-- 企业  -->
          <el-form
            label-position="top"
            label-width="80px"
            :model="ruleForm2"
            :rules="rules2"
            ref="ruleForm2"
            class="form"
            v-show="certificationType === 2"
          >
            <el-form-item label="Company/Organization Name" prop="realName">
              <div class="inputBox">
                <el-input
                  class="grayInput"
                  placeholder="Please enter company/organization name"
                  v-model="ruleForm2.realName"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="Country/Region" prop="country">
              <div class="inputBox">
                <el-select
                  v-model="ruleForm2.country"
                  placeholder="Please select the country/region"
                >
                  <el-option label="China" value="China"></el-option>
                  <el-option label="Other" value="Other"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="Business registration Number" prop="number">
              <div class="inputBox">
                <el-input
                  class="grayInput"
                  placeholder="Please enter your business registration number"
                  v-model.trim="ruleForm2.number"
                  clearable
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item
              label="Photo of business registration certificate"
              prop="registrationPhoto"
            >
              <div class="inputBox">
                <el-upload
                  action="#"
                  accept="image/*"
                  list-type="picture-card"
                  :file-list="fileList"
                  :limit="1"
                  :on-change="
                    (file, fileList) => handleChange(file, fileList, 2)
                  "
                  :auto-upload="false"
                  :class="[
                    fileList.length >= 1 ? 'hideUpload' : '',
                    'realNameUpload',
                  ]"
                >
                  <i
                    slot="default"
                    class="el-icon-plus"
                    v-if="!orgImageUrl"
                  ></i>
                  <div slot="file" slot-scope="{ file }" v-if="!orgImageUrl">
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                    <img class="avatar" :src="file.url" />
                    <i
                      class="el-icon-error iconRemove"
                      @click="handleRemove(file)"
                    ></i>
                  </div>
                  <img v-if="orgImageUrl" class="avatar" :src="orgImageUrl" />
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item prop="checkbox" class="checkBox" v-if="isShowConfirm">
              <el-checkbox v-model="ruleForm2.checkbox" label="" name=""
                >I confirm the information I submit are all genuine and I
                understand the liability of by providing false
                information.</el-checkbox
              >
            </el-form-item>
          </el-form>
          <div class="mt20" v-if="isShowConfirm">
            <el-button
              type="primary"
              round
              class="btnConfirm"
              @click="addRealNameApply"
              >confirm</el-button
            >
            <el-button round @click="resetForm('ruleForm')">clear</el-button>
          </div>
        </template>
        <!-- 第一步 / -->
        <!-- 第三步 -->
        <div
          class="stepResult"
          v-if="activeStep === 3 || activeStep === 4 || activeStep === 5"
        >
          <AuthSuccess v-if="activeStep === 3" />
          <AuthFail
            v-if="activeStep === 4"
            @toContinue="toContinue"
            :auditContent="auditContent"
          />
          <AuthAudit v-if="activeStep === 5" />
        </div>
        <!-- 第三步 / -->
      </div>
    </PersonalCenterLayout>
    <el-dialog
      title="Mobile phone scan authentication"
      :visible.sync="qrCodeVisible"
      width="400px"
      @opened="scanFaceIdentify"
      :center="true"
      :before-close="handleClose"
    >
      <div class="code-box" style="display: flex; justify-content: center">
        <!-- <img :src="qrCodeUrl" alt=""> -->
        <div id="headSignatureQr" ref="headSignatureQr"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PersonalCenterLayout from "@/components/PersonalCenterLayout";
import AuthSuccess from "@/components/RealName/AuthSuccess";
import AuthFail from "@/components/RealName/AuthFail";
import AuthAudit from "@/components/RealName/AuthAudit";
import API from "@/service/index";
import QRCode1 from "qrcodejs2";
import { checkIdNum, faceAuthErrMsg } from "@/utils/rules";
import { re } from "mathjs";

export default {
  components: {
    PersonalCenterLayout,
    AuthSuccess,
    AuthFail,
    AuthAudit,
  },
  inject: ["reload"],
  data() {
    // 必选框验证
    var validateAccept = (rule, value, callback) => {
      if (!value) {
        callback(new Error());
      } else {
        callback();
      }
    };
    // 校验身份证号
    var checkCardNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Please enter your ID number！"));
      } else {
        if (this.ruleForm.country == "China" && this.ruleForm.certType == "1") {
          if (checkIdNum(value)) {
            callback();
          } else {
            return callback(new Error("Please enter the correct ID number！"));
          }
        } else {
          callback();
        }
      }
    };
    // 上传图片验证
    var validPhoto = (rule, value, callback) => {
      if (!value) {
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      steps: [
        {
          key: 1,
          title: "fill in information",
        },
        {
          key: 2,
          title: "Face Recognition",
        },
        {
          key: 3,
          title: "The certification results",
        },
      ],
      ruleForm: {
        country: "China",
        certType: "1",
        realName: "",
        cardNumPhoto: "",
        number: "",
        checkbox: "",
      },
      rules: {
        certType: [
          {
            required: true,
            message: "Please select the id type",
            trigger: "change",
          },
        ],
        realName: [
          {
            required: true,
            message: "Please enter your name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 100,
            message: "The length is between 2 and 100 Characters",
            trigger: "blur",
          },
        ],
        number: [
          {
            validator: checkCardNum,
            trigger: "blur",
            required: true,
          },
        ],
        cardNumPhoto: [
          {
            validator: validPhoto,
            message: "Please select your identity photos！",
            trigger: "blur",
            required: true,
          },
        ],
        checkbox: [
          {
            validator: validateAccept,
            message: "The required box is not selected",
            trigger: "change",
          },
        ],
      },
      //TODO: 需要按照接口字段调整 新增企业form表单
      ruleForm2: {
        country: "China",
        certType: "",
        realName: "",
        number: "",
        checkbox: "",
        registrationPhoto: "",
      },
      //TODO: 需要按照接口字段调整
      rules2: {
        certType: [
          {
            required: true,
            message: "Please select the id type",
            trigger: "change",
          },
        ],
        realName: [
          {
            required: true,
            message: "Please enter company/organization name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 100,
            message: "The length is between 2 and 100 Characters",
            trigger: "blur",
          },
        ],
        number: [
          {
            message: "Please enter your business registration number",
            trigger: "blur",
            required: true,
          },
        ],
        registrationPhoto: [
          {
            validator: validPhoto,
            message:
              "Please select the photo of business registration certificate！",
            trigger: "blur",
            required: true,
          },
        ],
        checkbox: [
          {
            validator: validateAccept,
            message: "The required box is not selected",
            trigger: "change",
          },
        ],
      },
      activeStep: 1,
      authJumpUrl: "",
      errMsssage: "",
      code: null,
      qrCodeVisible: false,
      qrCodeUrl: "",
      timer: null,
      checkbox: false, // zhens
      certificationType: 1, //  身份类型
      uplpadFileUrl: "https://jsonplaceholder.typicode.com/posts/", //TODO:需修改 文件上传URL
      fileList: [],
      frontImageUrl: "",
      auditContent: "",
      userType: 1,
      personImageUrl: "",
      orgImageUrl: "",
      userStatus: 1,
    };
  },
  computed: {
    isAuthAudit() {
      const caseA = this.userStatus == 2;
      return caseA;
    },
    isAuthFail() {
      const caseA = this.userStatus == 3;
      return caseA;
    },
    isShowConfirm() {
      const caseA = this.userStatus == 0 || this.userStatus == 3;
      return caseA;
    },
  },
  mounted() {
    this.getCurrentUser();
    this.initInfo();
    this.code = this.$route.query.code;
    console.log("query: " + JSON.stringify(this.$route.query));
    console.log("code: " + this.code);
    if (this.code) {
      if (this.code === 0 || this.code === "0") {
        let orderNo = this.$route.query.orderNo;
        this.faceAuthentication();
      } else {
        this.errMsssage = faceAuthErrMsg(this.code + "");
        this.common.notification(this, this.errMsssage, 3);
        this.activeStep = 4;
      }
    }
  },
  methods: {
    // go on实名认证
    toContinue() {
      this.activeStep = 1;
    },
    // 选择身份
    changeCertificationType() {
      if (this.userStatus != 0) {
        this.certificationType = this.userType;
      }
      console.log(this.certificationType);
      this.ruleForm.cardNumPhoto = "";
      this.ruleForm2.registrationPhoto = "";
      this.fileList = [];
    },
    resetForm(ruleForm) {
      this.ruleForm.cardNumPhoto = "";
      this.ruleForm2.registrationPhoto = "";
      this.personImageUrl = "";
      this.orgImageUrl = "";
      this.fileList = [];
      this.$refs["ruleForm"].resetFields();
      this.$refs["ruleForm2"].resetFields();
      this.ruleForm.certType = 1;
    },
    initInfo() {
      API.getUserInfo({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((res) => {
        let _this = this;
        _this.userStatus = parseInt(res.data.status);
        if (_this.userStatus == 0) {
          _this.ruleForm.certType = 1;
          return;
        }
        _this.userType = parseInt(res.data.type);
        _this.certificationType = _this.userType;
        _this.auditContent = res.data.auditContent;
        if (_this.userType == 1) {
          _this.ruleForm.country = res.data.country;
          _this.ruleForm.certType = res.data.certType;
          _this.ruleForm.realName = res.data.realName;
          _this.ruleForm.number = res.data.number;
          _this.ruleForm.cardNumPhoto = res.data.frontImageUrl;
          _this.frontImageUrl = res.data.frontImageUrl;
          _this.personImageUrl = res.data.frontImageUrl;
        }
        if (_this.userType == 2) {
          _this.ruleForm2.country = res.data.country;
          _this.ruleForm2.certType = res.data.certType;
          _this.ruleForm2.realName = res.data.realName;
          _this.ruleForm2.number = res.data.number;
          _this.ruleForm2.registrationPhoto = res.data.frontImageUrl;
          _this.frontImageUrl = res.data.frontImageUrl;
          _this.orgImageUrl = res.data.frontImageUrl;
        }
        // const { step } = _this.$route.query;
        // if (_this.userStatus == 1 || _this.userStatus == 2 || _this.userStatus == 3 || step == 4) {
        //   if (step == 4) {
        //     _this.activeStep = 4;
        //   } else {
        //     if (_this.userStatus == 2) {
        //       _this.activeStep = 5;
        //     } else if (_this.userStatus == 3) {
        //       _this.activeStep = 4;
        //       _this.auditContent = res.data.auditContent;
        //     } else {
        //       _this.activeStep = 3;
        //     }
        //   }
        // } else {
        //   _this.activeStep = 1;
        // }
      });
    },
    // 修改用户实名状态
    // 实名认证申请
    addRealNameApply() {
      if (this.certificationType === 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            API.addRealNameApply({
              certificationId: window.localStorage.getItem("loginId"),
              realName: this.ruleForm.realName,
              number: this.ruleForm.number,
              country: this.ruleForm.country,
              frontImageUrl: this.frontImageUrl,
              certType: this.ruleForm.certType,
              type: this.certificationType,
            }).then((result) => {
              if (result.code !== 200) {
                this.common.notification(this, result.msg, 3);
                return;
              }
              this.common.notification(
                this,
                "Submitted for review, please be patient",
                1
              );
              this.reload();
            });
          } else {
            return;
          }
        });
      } else {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            API.addRealNameApply({
              certificationId: window.localStorage.getItem("loginId"),
              realName: this.ruleForm2.realName,
              number: this.ruleForm2.number,
              country: this.ruleForm2.country,
              frontImageUrl: this.frontImageUrl,
              certType: 0,
              type: this.certificationType,
            }).then((result) => {
              if (result.code !== 200) {
                this.common.notification(this, result.msg, 3);
                return;
              }
              this.common.notification(
                this,
                "Submitted for review, please be patient",
                1
              );
              this.reload();
            });
          } else {
            return;
          }
        });
      }
    },
    // 调到第二部
    handleSecond() {
      // TODO: 需要处理
      if (this.certificationType === 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            localStorage.setItem("name", this.ruleForm.realName);
            localStorage.setItem("idCard", this.ruleForm.cardNum);
            this.activeStep = 2;
          } else {
            return;
          }
        });
      } else {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
          } else {
            return;
          }
        });
      }
    },
    // 人脸识别下一步
    handleNext() {
      const name = localStorage.getItem("name");
      const idCard = localStorage.getItem("idCard");
      if (name && idCard) {
        API.getFaceIdForPc({
          name: name,
          idNo: idCard,
          loginId: window.localStorage.getItem("loginId"),
        }).then(async (result) => {
          console.log("getFaceIdForPC：" + JSON.stringify(result));
          var _this = this;
          if (result.code == 200) {
            // 在这将事件传递出去
            localStorage.setItem("name", name);
            localStorage.setItem("idCard", idCard);
            // localStorage.setItem("code", _this.code);
            var param = {
              userId: result.data.userId,
              nonce: result.data.nonce,
              orderNo: result.data.orderNo,
              faceId: result.data.faceId,
              type: "1",
            };
            var authJumpUrl = await API.startPcFace(param).then(
              async (result) => {
                console.log("pcFace" + JSON.stringify(result));
                if (result.code == 200) {
                  return result.data;
                }
              }
            );
            console.log(authJumpUrl);
            window.location.href = authJumpUrl;
          } else {
            this.common.notification(
              this,
              "Identity information does not match！",
              3
            );
            return;
          }
        });
      }
    },
    // 扫码人脸识别
    scanFaceIdentify() {
      API.getFaceIdForH5({
        name: this.ruleForm.realName,
        idNo: this.ruleForm.cardNum,
        loginId: window.localStorage.getItem("loginId"),
      }).then(async (result) => {
        console.log("getFaceIdForH5：" + JSON.stringify(result));
        var _this = this;
        if (result.code == 200) {
          // 在这将事件传递出去
          localStorage.setItem("name", _this.ruleForm.realName);
          localStorage.setItem("idCard", _this.ruleForm.cardNum);
          // localStorage.setItem("code", this.code);
          var param = {
            userId: result.data.userId,
            nonce: result.data.nonce,
            orderNo: result.data.orderNo,
            faceId: result.data.faceId,
            type: "2",
          };
          var authJumpUrl = await API.startH5Face(param).then(
            async (result) => {
              console.log("h5Face" + JSON.stringify(result));
              if (result.code == 200) {
                return result.data;
              }
            }
          );
          console.log("H5人脸识别url" + authJumpUrl);
          let dom = document.getElementById("headSignatureQr");
          document.getElementById("headSignatureQr").innerHTML = "";
          new QRCode1(dom, {
            text:
              authJumpUrl +
              "&loginId=" +
              window.localStorage.getItem("loginId"),
            width: 150,
            height: 150,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode1.CorrectLevel.L, //容错率，L/M/H
          });
          this.qrCodeVisible = true;
        } else {
          this.common.notification(
            this,
            "Identity information does not match！",
            3
          );
          return;
        }
      });
      this.setTimer(2000);
    },
    // 轮询查询用户实名状态
    setTimer(initMilliecond) {
      let _this = this;
      _this.timer = setInterval(() => {
        API.getUserInfo({
          certificationId: window.localStorage.getItem("loginId"),
        }).then((result) => {
          if (result.code === 200 && result.data != null) {
            var userStatus = result.data.status;
            // 认证成功
            if (userStatus === 1) {
              clearInterval(_this.timer);
              _this.qrCodeVisible = false;
              _this.activeStep = 3;
            }
            // 认证失败
            if (userStatus === 3) {
              clearInterval(_this.timer);
              _this.qrCodeVisible = false;
              _this.activeStep = 4;
            }
          }
        });
      }, initMilliecond);
    },
    // PC人脸识别回调
    faceAuthentication() {
      API.faceAuthentication({
        certificationId: window.localStorage.getItem("loginId"),
        type: 1,
        realName: localStorage.getItem("name"),
        number: localStorage.getItem("idCard"),
        isLand: 1,
        invitorAmount: 50,
      }).then((result) => {
        console.log("PC人脸识别回调信息：" + JSON.stringify(result));
        if (result.code !== 200) {
          this.common.notification(this, result.msg, 3);
          return;
        }
        this.activeStep = 3;
      });
    },
    // 关闭扫描二维码弹框
    handleClose() {
      console.log("关");
      this.qrCodeVisible = false;
      if (this.timer) {
        window.clearInterval(this.timer);
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList.splice(0, 1);
      this.personImageUrl = "";
      this.orgImageUrl = "";
    },
    beforeAvatarUpload(file) {
      const isIMG =
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // TODO: 大小更改
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error(
          "A logo image can be uploaded in JPG, JPEG, PNG, or GIF formats!"
        );
      }
      if (!isLt2M) {
        this.$message.error("The size of the uploaded logo cannot exceed 2MB!");
      }
      return isIMG && isLt2M;
    },
    handleChange(file, fileList, type) {
      console.log("file", file);
      this.fileList = fileList;
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        let formData = new FormData();
        formData.append("imgFile", file.raw);
        this.$API.uploadImg(formData).then((result) => {
          console.log("图片上传结果：" + JSON.stringify(result));
          if (result.code !== 200) {
            return;
          }
          this.frontImageUrl = API.getAvatarAccessPrefix() + result.imgUrl;
          this.personImageUrl = "";
          this.orgImageUrl = "";
        });
      };

      if (type === 1) {
        this.ruleForm.cardNumPhoto = file.raw;
      } else {
        this.ruleForm2.registrationPhoto = file.raw;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pcPageCont {
  color: #000000;
  .form {
    width: 520px;
  }
  .partTitle {
    font-size: 24px;
    margin-bottom: 40px;
  }
  /deep/.el-form--label-top .el-form-item__label {
    color: #000000;
    &:before {
      display: none;
    }
  }
  /deep/input {
    width: 100%;
    color: #000000;
    border: 1px solid #000000;
    border-radius: 8px;
  }
  /deep/.el-select {
    width: 100%;
  }
}

.stepFace {
  .cardBox {
    position: relative;
    width: 2rem;
    height: 2rem;
    margin: 0.53rem auto 0.85rem;
    .borderSpan:nth-child(1) {
      position: absolute;
      left: -0.02rem;
      top: -0.02rem;
      padding: 0.15rem;
      border-style: solid;
      border-color: #79c8d6;
      border-width: 0.02rem 0 0 0.02rem;
      border-top-left-radius: 0.1rem;
    }
    .borderSpan:nth-child(2) {
      position: absolute;
      right: -0.02rem;
      top: -0.02rem;
      padding: 0.15rem;
      border-style: solid;
      border-color: #79c8d6;
      border-width: 0.02rem 0.02rem 0 0;
      border-top-right-radius: 0.1rem;
    }
    .borderSpan:nth-child(3) {
      position: absolute;
      right: -0.02rem;
      bottom: -0.02rem;
      padding: 0.15rem;
      border-style: solid;
      border-color: #79c8d6;
      border-width: 0 0.02rem 0.02rem 0;
      border-bottom-right-radius: 0.1rem;
    }
    .borderSpan:nth-child(4) {
      position: absolute;
      left: -0.02rem;
      bottom: -0.02rem;
      padding: 0.15rem;
      border-style: solid;
      border-color: #79c8d6;
      border-width: 0 0 0.02rem 0.02rem;
      border-bottom-left-radius: 0.1rem;
    }
    .cardInnerImg {
      position: absolute;
      width: 1.5rem;
      height: 1.5rem;
      left: 0.25rem;
      right: 0.25rem;
      top: 0.25rem;
      bottom: 0.3rem;
      background: url("../assets/images/img_renlian@2x.png") no-repeat center;
      background-size: cover;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .faceTip {
    margin-bottom: 0.53rem;
    font-size: 0.16rem;
    color: #666;
    text-align: center;
    span {
      color: #ed4646;
      cursor: pointer;
    }
  }
  .btnRowFace {
    margin: 0;
    text-align: center;
  }
  .btnFaceNext {
    margin-left: 0.27rem;
  }
}
/deep/ .certificationTypeRadio {
  margin-bottom: 10px;
  .el-radio-button__inner {
    background: rgba(255, 255, 255, 0.1);
    color: #000000;
    border-color: transparent;
    border-radius: 20px;
  }
  .el-radio-button {
    margin-right: 20px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #000000;
    border-color: #000000;
    box-shadow: -1px 0 0 0 #000000;
  }
  .el-radio-button--medium .el-radio-button__inner {
    padding: 8px 20px;
  }
}
.mt20 {
  margin-top: 20px;
}
/deep/ .realNameUpload {
  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload--picture-card {
    display: flex;
    align-items: center;
    justify-content: center;
    //border: 1px dashed rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    width: 360px;
    height: 180px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #999999;
    &:hover {
      opacity: 0.8;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 360px;
    height: 180px;
  }
}
.avatar {
  width: 360px;
  height: 180px;
  display: block;
}

.iconRemove {
  position: absolute;
  font-size: 0.24rem;
  color: #fd4a4a;
  right: 0.05rem;
  top: 0.05rem;
}
.hideUpload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
.authSuccess {
  margin-top: -100px;
  text-align: center;
}
.auditIco {
  width: 1.56rem;
  height: 1.06rem;
  margin: 0.8rem auto 0.36rem;
  background: url("../assets/images/auth_audit_wait@2x.png") no-repeat center;
  background-size: contain;
}
.failIco {
  width: 1.56rem;
  height: 1.06rem;
  margin: 0.8rem auto 0.36rem;
  background: url("../assets/images/auth_shibai@2x.png") no-repeat center;
  background-size: contain;
}
.successTxt {
  margin-bottom: 0.21rem;
  font-size: 0.2rem;
  color: #000000;
  font-weight: 500;
}
.subTitle {
  margin-bottom: 0.6rem;
  span,
  p {
    font-size: 0.16rem;
    font-weight: 500;
    line-height: 0.35rem;
    color: #000000;
  }
}
</style>
