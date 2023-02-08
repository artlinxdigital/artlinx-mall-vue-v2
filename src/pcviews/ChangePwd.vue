<template>
	<div class="pageContainer changePwd">
		<div class="content-wrap">
			<PersonalCenterLayout activeKey="1-3">
				<div class="psd">
					<el-form class="form" label-position="top" label-width="130px" :model="ruleForm" :rules="rules" ref="ruleForm">
						<h3 class="pcPage pageTitle">Change Password</h3>
						<el-form-item label="Original password" prop="oldPwd">
							<el-input class="withEye" placeholder="Please enter your old password" v-model.trim="ruleForm.oldPwd" :type="oldPwdType" clearable>
								<i slot="suffix" class="iconfont" :class="oldPwdType =='text' ? 'icon-kejian' : 'icon-bukejian'" @click="toggleOldPwdType"></i>
							</el-input>
							<div class="tip">To ensure the security of your account, enter the old password before changing the password</div>
						</el-form-item>
						<el-form-item label="Enter a new password" prop="pwd">
							<el-input class="withEye" placeholder="Please enter a new password" v-model.trim="ruleForm.pwd" :type="pwdType" clearable>
								<i slot="suffix" class="iconfont" :class="pwdType == 'text'? 'icon-kejian' : 'icon-bukejian' " @click="togglePwdType"></i>

							</el-input>
						</el-form-item>
						<el-form-item label="Confirm the new password" prop="confirmPwd">
							<el-input class="withEye" placeholder="Please confirm the new password" v-model.trim="ruleForm.confirmPwd" :type="pwdConfirmType" clearable>
								<i slot="suffix" class="iconfont" :class="pwdConfirmType =='text' ? 'icon-kejian' : 'icon-bukejian'" @click="togglePwdConfirmType"></i>
							</el-input>
						</el-form-item>
					</el-form>
					<div class="btnRow">
						<el-button type="primary" round class="btnConfirm" @click="changePwd">confirm</el-button>
						<el-button class="btnCancel" round @click="resetForm('ruleForm')">cancel</el-button>
					</div>
				</div>
			</PersonalCenterLayout>
		</div>
	</div>
</template>

<script>
	import PersonalCenterLayout from "@/components/PersonalCenterLayout";
	import API from '@/service/index';
	import { re } from 'mathjs';

	const sm3 = require("sm-crypto").sm3;

	export default {
		components: {
			PersonalCenterLayout,

		},
		data() {
			return {
				ruleForm: {
					oldPwd: "",
					pwd: "",
					confirmPwd: "",
				},
				rules: {
					oldPwd: [{
						required: true,
						message: "Please enter your old hosting password",
						trigger: "blur"
					}],
					pwd: [{
						required: true,
						message: "Please create your login password and memorise it firmly!",
						trigger: "blur"
					}],
					confirmPwd: [{
						required: true,
						message: "Please confirm your hosting password",
						trigger: "blur"
					}]
				},
				oldPwdType: 'password',
				pwdType: 'password',
				pwdConfirmType: 'password',
			}
		},
		mounted() {this.getCurrentUser();},
		methods: {
			togglePwdType() {
				this.pwdType = this.pwdType === 'text' ? 'password' : 'text';
			},
			togglePwdConfirmType() {
				this.pwdConfirmType = this.pwdConfirmType === 'text' ? 'password' : 'text';
			},
			toggleOldPwdType() {
				this.oldPwdType = this.oldPwdType === 'text' ? 'password' : 'text';
			},
			// 修改密码
			changePwd() {
				this.$refs.ruleForm.validate(valid => {
					if(valid) {
						// 输入的原密码和登录密码比较
						if(sm3(this.ruleForm.oldPwd) !== sessionStorage.getItem("enPass")) {
							this.common.notification(this, "Please enter the correct old password!", 2);
							return;
						}
						var pwd = this.ruleForm.pwd;
						if(pwd.length < 8) {
							this.common.notification(this, "Please enter at least 8 characters!", 2);
							return;
						}
						if(pwd.length > 30) {
							this.common.notification(this, "Please enter a maximum of 30 characters!", 2);
							return;
						}
						if(pwd != this.ruleForm.confirmPwd) {
							this.common.notification(this, "The escrow passwords entered before and after are inconsistent", 2);
							return;
						}
						API.getUserByAccountAndType({
							account: this.getCurrentUser().account,
							type: 1
						}).then(result => {
							// console.log("用户信息：" + JSON.stringify(result));
							if(result.code !== 200) {
								this.common.notification(this, "Failed to change the password. Please try again later,Please wait for a moment！", 3);
								return;
							}
							let resetEncryptInfoList = [];
							let resetPojo = {};
							let user = result.data;
							if(!user.privateKeys[0]) {
								return;
							}
							let privateKey = this.forSM4DecryptPK(sessionStorage.getItem("enPass"), user.privateKeys[0]);
							// console.log(privateKey);
							if(privateKey && privateKey.length == 64) {
								// 循环所有的私钥解析除加密前的私钥
								resetPojo.pk = privateKey;
								resetPojo.loginId = user.id;
								resetPojo.operationId = user.id;

								// 加密所有的私钥--改为sm3加密
								let pwd = sm3(this.ruleForm.pwd);
								console.log(pwd);

								let sePrivateKey = this.$sm4.encrypt_ecb(privateKey, pwd);
								resetPojo.encryptPrivateKey = sePrivateKey;
								// 加密后的托管密码--改为sm3加密
								let pwdPriKey = sm3(privateKey);
								let seHostPass = this.$sm4.encrypt_ecb(this.ruleForm.pwd, pwdPriKey);
								resetPojo.encryptPassword = seHostPass;
								resetPojo.type = 1;
							} else {
								this.common.notification(this, "Managed password error", 3);
								return;
							}
							resetPojo.pk = "";
							resetEncryptInfoList.push(resetPojo);
							console.log(resetEncryptInfoList);
							// 修改密码
							API.resetPwdByPrivateKey({
								resetEncryptParamList: resetEncryptInfoList
							}).then(result => {
								if(result.code !== 200) {
									this.common.notification(this, "Failed to change the password. Please try again later, Please try again later！", 3);
									return;
								}
								this.common.notification(this, "Password changed successfully, please log in again!", 1);
								this.confirmQuit();
							});
						});
					} else {
						return;
					}
				});
			},
			//cancel
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 清除数据重新登录
			confirmQuit() {
				// 清除数据
				localStorage.clear();
				sessionStorage.clear();
				// 跳转登录页面
				this.$router.push({
					path: '/login'
				});
			},
			//解密-sm4
			forSM4DecryptPK(enPasss, pk) {
				console.log("enpass", "pk");
				let privateKey = "";
				try {
					privateKey = this.sm4decrypt(pk, enPasss);
				} catch(e) {
					console.log(e);
				}
				// console.log(privateKey);
				if(privateKey) {
					return privateKey;
				}
			},
			sm4decrypt(word, pwd) {
				let decrypt = this.$sm4.decrypt_ecb(word, pwd);
				return decrypt;
			},
		}
	}
</script>

<style lang="less" scoped>
	.changePwd {
		min-height: 100vh;
		/deep/ .el-form--label-top {
			.el-form-item__label {
				margin-bottom: 15px;
				padding-bottom: 0;
				color: #000000;
				font-weight: 500;
				line-height: 1;
				&:before {
					display: none;
				}
			}
		}
		/deep/ .el-form-item {
			margin-bottom: 30px;
			.el-input__inner {
				background: rgba(255, 255, 255, 0.08);
				width: 100%;
				color: #FFFFFF;
				border:1px solid #000000;
				border-radius: 8px;
			}
		}
	}

	.iconfont {
		line-height: 40px;
	}

	/deep/.personContent {
		.psd {
			width: 520px;
			margin: 0px;
		}
	}

	.btnRow {
		margin-top: 30px;
		text-align: center;
	}

	.tip {
		color: #b0b0b0;
		font-size: 12px;
		line-height: 1;
		margin-top: 15px;
	}

	.pageTitle {
		font-size: 24px;
		margin-bottom: 40px;
	}

	.content-wrap {
		width: 1186px;
		min-height: 75vh;
		margin: 0 auto;
	}
</style>
