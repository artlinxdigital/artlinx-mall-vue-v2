<template>
	<div class="chargeContainer" v-loading.fullscreen.lock="loading" :element-loading-text="loadingText">

		<div class="contentBox fWhite">

			<div class="flexRowInfo">
				<span class="flexRowLabel">Recharge:</span>
				<span class="flexRowVal">{{mobile || '-'}}</span>
			</div>

			<div class="flexRowInfo">
				<span class="flexRowLabel">credit</span>
				<div class="flexRow">
					<div v-for="item in monyTypes" :key="item.id" class="grid" :class="{ activeGrid: item.id === selectMony }" @click="changeSelectMoney(item.id, item.amount)">
						{{ item.amount }}HK$
					</div>
				</div>
			</div>
			<div class="flexRowInfo">
				<span class="flexRowLabel">Other amount</span>
				<el-input id="enterAmount" class="customInput" type="text" placeholder="Please enter the recharge amount" v-model.trim="amount" min="1" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" @blur="enterAmount">
					<i slot="suffix" class="el-input__icon">HK$</i>
				</el-input>
			</div>

			<div class="flexRowInfo">
				<span class="flexRowLabel">Payment</span>
				<div class="flexRow pay">
					<div class="payWayItem" v-for="item in payWay" :class="{active: item.id === selectWayId}" :key="item.id" @click="changePayWay(item.id)">
						<span class="wayName" :class="[item.id, { active: item.id === selectWayId }]"><i class="iconfont" :class="[item.icon, { active: item.id === selectWayId }]"></i>{{ item.name }}</span>
					</div>
				</div>
			</div>

			<div class="fixBtn">
				<el-button type="primary" round class="btnRecharge" @click="startAliPay()">Pay</el-button>
				<el-button type="info" round @click="$router.go(0)">cancel</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import API from "@/service/index";
	import Web3 from "web3";

	var web3;
	if(typeof web3 !== "undefined") {
		if(web3.currentProvider.isMateMask) {
			new Web3.providers.HttpProvider(API.getNetWorkUrl());
		} else {
			web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
		}
	} else {
		//https://mainnet.infura.io/mew  http://47.74.44.123:7575   ?????? http://47.74.39.49:7575
		web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
	}

	export default {
		components: {

		},
		inject: ["reload"],
		data() {
			return {
				monyTypes: [{
						id: "1",
						amount: "50",
					},
					{
						id: "2",
						amount: "100",
					},
					{
						id: "3",
						amount: "200",
					},
					{
						id: "4",
						amount: "500",
					},
					{
						id: "5",
						amount: "1000",
					},
					{
						id: "6",
						amount: "2000",
					},
				],
				selectMony: "1",
				selectAmount: "0",
				amount: "",
				payWay: [{
						id: "alipay",
						name: "Alipay",
						icon: "icon-zhifubao",
					},
					{
						id: "wepay",
						name: "WeChat Pay",
						icon: "icon-weixin",
					},
				],
				selectWayId: "alipay",
				payType: 2,
				defineAmount: 50,
				balance: 0,
				loading: false,
				loadingText: "Please wait for a moment",
				mobile: ''
			};
		},
		mounted() {this.getCurrentUser();
			// ??????????????????
			API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") }).then(res => {
				this.balance = res.data.balance;
				this.mobile = res.data.mobile;
			}).catch(err => {
				console.error(err);
			});
			// ??????????????????
			// this.getChargeList();
			// ??????????????????
			this.getUserBalance();
		},
		methods: {
			// ??????????????????
			getUserBalance() {
				web3.eth
					.getBalance(window.localStorage.getItem("walletAddress"))
					.then((result) => {
						var balanceCurr = web3.utils.fromWei(result, "ether");
						console.log("balanceCurr???" + balanceCurr);
						this.balance = parseFloat(balanceCurr).toFixed(2);
					});
			},

			// ????????????????????????
			getChargeList() {
				API.getChargeList({
					certificationId: window.localStorage.getItem("loginId"),
				}).then((result) => {
					if(result.code !== 200) {
						this.common.notification(this, "Failed to query user recharge records. Procedure", 3);
						return;
					}
					console.log("chargeListInfo: " + JSON.stringify(result));
				});
			},
			// ????????????
			changeSelectMoney(id, amount) {
				this.selectMony = id;
				this.selectAmount = amount;
				this.defineAmount = amount;
			},
			// ??????????????????
			changePayWay(id) {
				this.selectWayId = id;
				if(id == "wepay") {
					this.payType = 1;
				}
				if(id == "alipay") {
					this.payType = 2;
				}
			},
			// ?????????????????????
			enterAmount() {
				if(this.amount) {
					this.defineAmount = parseInt(this.amount);
					this.selectMony = "0";
				} else {
					this.defineAmount = parseInt(this.selectAmount);
					this.selectMony = "1";
				}
			},
			// ??????
			charge() {
				if(this.defineAmount <= 0) {
					if(this.selectMony == "0") {
						this.common.notification(this, "Please enter the correct recharge amount", 3);
					} else {
						this.common.notification(this, "Please select the amount to be recharged", 3);
					}
					return;
				}
				API.addCharge({
					money: this.defineAmount,
					type: this.payType,
					address: window.localStorage.getItem("walletAddress"),
				}).then((result) => {
					if(result.code !== 200) {
						this.common.notification(this, result.msg, 3);
						return;
					}
					this.loading = true;
					// ????????????????????????
					// this.getUserInfo();
					let that = this;
					that.time = window.setInterval(async() => {
						var newBalance = await web3.eth
							.getBalance(window.localStorage.getItem("walletAddress"))
							.then((result) => {
								var newBalanceCurr = web3.utils.fromWei(result, "ether");
								console.log("newBalanceCurr???" + newBalanceCurr);
								return parseFloat(newBalanceCurr).toFixed(2);
							});
						if(newBalance != this.balance) {
							window.clearInterval(that.time);
							that.loading = false;
							that.reload();
							that.common.notification(this, "be recharged successfully.", 1);
						}
					}, 2000);
				});
			},
			// Alipay/WeChat Pay
			startAliPay() {
				if (this.defineAmount <= 0) {
					if(this.selectMony == "0") {
						this.common.notification(this, "Please enter the correct recharge amount", 3);
					} else {
						this.common.notification(this, "Please select the amount to be recharged", 3);
					}
					return;
				}
				this.$emit("payNow", this.payType, this.defineAmount);
			}
		},
	};
</script>

<style lang="less" scoped>
	.grid {
		width: 160px;
		height: 48px;
		line-height: 48px;
		border-radius: 8px;
		text-align: center;
		font-size: 16px;
		margin: 5px 0;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.06);
		&.activeGrid {
			border: 2px solid #000000;
		}
	}

	.customInput {
		flex: 1;
		border: 0;
		outline: none;
		/deep/input {
			background: rgba(255, 255, 255, 0.08);
			width: 100%;
			color: #FFFFFF;
			box-shadow: 0px 2px 8px 0px rgba(22, 21, 54, 0.5);
			border: none;
			border-radius: 8px;
		}
	}

	.payWayItem {
		display: flex;
		align-items: center;
		width: 205px;
		height: 64px;
		line-height: 64px;
		margin: 0 20px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 16px;
		cursor: pointer;
		span {
			padding-left: 30px;
		}
		&.active {
			border: 2px solid #000000;
		}
		.alipay {
			i {
				color: #2068FF;
			}
		}
		.wayName {
			display: flex;
			align-items: center;
			i {
				font-size: 24px;
				padding-right: 10px;
			}
		}
		.wepay {
			i {
				color: #27FF4E;
			}
		}
	}

	.fixBtn {
		padding: 40px 0;
		text-align: center;
	}

	.flexRow {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.flexRow.pay {
		justify-content: center;
	}

	.flexRowInfo {
		margin-bottom: 15px;
	}

	.flexRowLabel {
		margin-right: 15px;
		color: #B0B0B0;
		margin-bottom: 10px;
		display: inline-block;
		font-weight: 500;
	}

	.flexRowVal {
		font-weight: 500;
	}
	/deep/.el-dialog__header {
  line-height: 24px;
}
</style>
