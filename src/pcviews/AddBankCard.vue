<template>
	<div class="pageContainer addBankCard">
		<div class="ruleForm">
			<el-form :model="form" ref="form" label-width="1.25rem" label-position="top" size="small">
				<div class="formGroup">
					<el-form-item label="open an account" prop="bankName">
						<el-select v-model="form.bankName" placeholder="Please Select" style="width: 100%;">
							<el-option v-for="item in bankList" :key="item.bankKey" :label="item.bankName" :value="item.bankName">
								<div class="cardLi" :class="item.bankIcon">
									<span>{{ item.bankName }}</span>
								</div>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Account opening branch" prop="bankSubName">
						<el-input v-model.trim="form.bankSubName" placeholder="Please enter the opening branch"></el-input>
					</el-form-item>
					<el-form-item label="Card No" prop="bankCardNum">
						<el-input v-model.trim="form.bankCardNum" placeholder="Please enter your bank card number"></el-input>
					</el-form-item>
				</div>
				<div class="formGroup">
					<el-form-item label="E-mail" prop="phone">
						<el-input v-model.trim="form.phone" placeholder="Please enter email address!"></el-input>
					</el-form-item>
					<el-form-item label="code" prop="msgCode" class="codeItem">
						<el-input v-model.trim="form.msgCode" placeholder="Please input the verification code in your email" maxlength="6" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
							<el-button slot="suffix" size="mini" type="primary" :disabled="isDisabled" @click="getCode" v-html="timeNum == 60 ? 'Please input the verification code in your email' : `${timeNum}s`" class="el-input__icon iconBtnSendCode">Please input the verification code in your email</el-button>
						</el-input>
					</el-form-item>
				</div>
			</el-form>
			<div class="btnRow">
				<el-button type="primary"  round class="btnConfirm" @click="addBank">add</el-button>
				<el-button class="btnConfirm" round @click="$router.go(0)">cancel</el-button>

			</div>
		</div>
	</div>
</template>

<script>
	import API from "@/service/index";
	import { checkEmail } from "@/utils/rules";
	export default {
		data() {
			return {
				form: {
					bankName: "",
					bankSubName: "",
					bankCardNum: "",
					phone: "",
					msgCode: "",
				},
				selectBank: "",
				dialogVisible: false,
				bankList: [],
				isDisabled: false,
				timeNum: 60,
			};
		},
		mounted() {this.getCurrentUser();
			// 查询银行配置列表
			this.getBankConfigList();
		},
		methods: {
			// 获取短信验证码
			getCode() {
				var phone = this.form.phone;
				if(!phone) {
					this.common.notification(this, "Please enter email address!", 2);
					return;
				} else {
					if(!checkEmail(phone)) {
						this.common.notification(this, "Please enter the correct email address!", 3);
						return;
					}
				}
				API.getCode({
					account: phone
				}).then((result) => {
					if(result.code !== 200) {
						this.common.notification(this, result.msg, 3);
						return;
					} else {
						this.common.notification(this, "Successfully sent, please check the verification code！", 1);
						this.isDisabled = true;
						this.timer = setInterval(() => {
							this.timeNum--;
							if(this.timeNum == 0) {
								this.isDisabled = false;
								window.clearInterval(this.timer);
								this.timeNum = 60;
							}
						}, 1000);
					}
				});
			},
			// 获取银行配置列表
			getBankConfigList() {
				API.getBankConfigList({}).then((result) => {
					if(result.code !== 200) {
						this.common.notification(this, "Data loading failure", 3);
						return;
					}
					if(result.data !== null) {
						this.bankList = result.data;
					}
				});
			},
			// 添加bank card
			addBank() {

				// open an account
				var bankName = this.form.bankName;
				if(!bankName) {
					this.common.notification(this, "Please select an opening bank！", 3);
					return;
				}
				// 开户支行
				var bankSubName = this.form.bankSubName;
				if(!bankSubName) {
					this.common.notification(this, "Please enter the opening branch！", 3);
					return;
				}
				// bank card号
				var bankCardNum = this.form.bankCardNum;
				const strBin =
					"10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
				if(!bankCardNum) {
					this.common.notification(this, "Please enter your bank card number！", 3);
					return;
				} else if(!Number.isInteger(+bankCardNum)) {
					this.common.notification(this, "The bank card number must be all numbers！", 3);
					return;
				} else if(
					bankCardNum.trim().length < 12 ||
					bankCardNum.trim().length > 19
				) {
					this.common.notification(this, "The bank card number must be between 12 and 19 in length!", 3);
					return;
				} else if(strBin.indexOf(bankCardNum.substring(0, 2)) === -1) {
					this.common.notification(this, "Bank card number beginning 6 do not accord with standard!", 3);
					return;
				}
				// 邮箱地址
				var phone = this.form.phone;
				if(!phone) {
					this.common.notification(this, "Please enter email address!", 3);
					return;
				} else {
					if(!checkEmail(phone)) {
						this.common.notification(this, "Please enter the correct email address!", 3);
						return;
					}
				}
				// 验证码
				var msgCode = this.form.msgCode;
				if(!msgCode) {
					this.common.notification(this, "Please input the verification code in your email！", 3);
					return;
				}
				API.addWithdrawConfig({
					certificationId: window.localStorage.getItem("loginId"),
					walletAddress: window.localStorage.getItem("walletAddress"),
					mobile: phone,
					account: this.getCurrentUser().account,
					accountBank: bankName,
					accountSubBank: bankSubName,
					bankCard: bankCardNum,
					configType: 3,
					msgCode: msgCode,
				}).then((result) => {
					console.log("Add withdrawal information result：" + JSON.stringify(result));
					if(result.code !== 200) {
						this.common.notification(this, "fail to add", 3);
						console.log("Description Failed to add the withdrawal information");
						return;
					}
					this.common.notification(this, "successfully added", 1);
					this.$router.go(0);
				});
			},
		},
	};
</script>

<style lang="less" scoped>
	.bg(@file, @width, @height) {
		width: @width;
		height: @height;
		background: url("@{file}") no-repeat;
		background-size: 100% 100%;
	}

	/deep/ input.el-input__inner {
		background: #ffffff;
		width: 100%;
		color: #000000;
		//box-shadow: 0px 2px 8px 0px rgba(22, 21, 54, 0.5);
		border: 1px solid #000000;
		border-radius: 8px;
		line-height: 40px;
		height: 40px;
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
		padding: 0 0.24rem;
		@media screen and (min-width: 800px) {
			padding: 0;
		}
		/deep/ .el-form-item {}
	}

	.btnRow {
		text-align: center;
		.btnConfirm {
			margin:0 10px;
		}
	}

	.cardLi {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
		&::before {
			content: "";
			width: 0.25rem;
			height: 0.25rem;
			margin-right: 0.05rem;
		}
		&.gs {
			&::before {
				.bg("../assets/images/bank/zhongguogongshangyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.js {
			&::before {
				.bg("../assets/images/bank/zhongguojiansheyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.zgyh {
			&::before {
				.bg("../assets/images/bank/zhongguoyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.zgyzcxyh {
			&::before {
				.bg("../assets/images/bank/zhongguoyouzhengchuxuyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.nyyh {
			&::before {
				.bg("../assets/images/bank/nongyeyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.jtyh {
			&::before {
				.bg("../assets/images/bank/jiaotongyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.zsyh {
			&::before {
				.bg("../assets/images/bank/zhaoshangyinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.pfyh {
			&::before {
				.bg("../assets/images/bank/pufayinhang@2x.png",
				0.25rem,
				0.25rem);
			}
		}
		&.payh {
			&::before {
				.bg("../assets/images/bank/zhongguopingan@2x.png",
				0.25rem,
				0.25rem);
			}
		}
	}

	.ruleForm {
		width: 512px;
		margin: 0 auto;
		/deep/ .el-input--small .iconBtnSendCode {
			width: 100px;
			background:none ;
			color: #4B89FB;
			border: none;

		}
		/deep/.el-input__suffix-inner{line-height:40px ;}
	}
</style>
