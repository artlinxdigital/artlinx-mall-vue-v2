<template>
	<div class="container">
		<PersonalCenterLayout activeKey="2-1">
			<div class="innerContent">
				<h2 class="pcPageTitle">Transactions</h2>
				<!-- <AccountBankCard :balance="balance" :userStatus.sync="userStatus" /> -->

				<div class="bankManage">
					<span class="bankName">Bank card</span>
				</div>
				<BankCards />
				<h3 class="subTitle">Card setting</h3>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="Recorded" name="charge">
						<RechargeRecord />
					</el-tab-pane>
					<el-tab-pane label="Charge Off" name="withdraw">
						<WithdrawRecord />
					</el-tab-pane>
				</el-tabs>
			</div>
		</PersonalCenterLayout>
	</div>
</template>

<script>
	import PersonalCenterLayout from "@/components/PersonalCenterLayout";
	import RechargeRecord from "@/components/FundingManage/RechargeRecord";
	import WithdrawRecord from "@/components/FundingManage/WithdrawRecord";
	import BankCards from "@/components/FundingManage/BankCards";
	import AccountBankCard from "@/pcviews/PersonalCenter/AcountBalanceCard";
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
		//https://mainnet.infura.io/mew  http://47.74.44.123:7575   新的 http://47.74.39.49:7575
		web3 = new Web3(new Web3.providers.HttpProvider(API.getNetWorkUrl()));
	}

	export default {
		components: {
			PersonalCenterLayout,
			AccountBankCard,
			RechargeRecord,
			WithdrawRecord,
			BankCards
		},
		data() {
			return {
				balance: "0",
				userStatus: 1,
				activeName: 'charge',
			}
		},
		mounted() {this.getCurrentUser();
			API.getUserInfo({ certificationId: window.localStorage.getItem("loginId") }).then(res => {
				this.userStatus = res.data.status;
			}).catch(err => {
				console.error(err);
			});
			// 查询地址余额
			this.getUserBalance();
		},
		methods: {
			// 查询地址余额
			getUserBalance() {
				web3.eth
					.getBalance(window.localStorage.getItem("walletAddress"))
					.then((result) => {
						var balanceCurr = web3.utils.fromWei(result, "ether");
						console.log('=====', balanceCurr);
						this.balance = parseFloat(balanceCurr).toFixed(2);
					});
			},
			handleClick() {

			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		min-height: 100vh;
	}
	.bankManage{
		margin-top:50px ;
	}
	.pcPageTitle {
		font-size: 24px;
		margin-bottom: 40px;
	}

	.innerContent {
		min-height: 80vh;
	}

	.subTitle {
		font-size: 16px;
		margin-bottom: 20px;
	}
	/deep/.el-tabs__nav-wrap::after {
		display: none;
	}
	/deep/.el-table::before {
		display: none;
	}
	/deep/ .el-tabs__item {
		width: 80px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		border-radius: 16px;
		color: #000000;
		padding: 0;
		background:#ffffff;
    border:1px solid #000000;
		margin-right: 15px;
		&.is-active {
			background: #000000;
			color: #FFFFFF;
		}
	}

	/deep/.el-tabs__active-bar.is-top {
		display: none;
	}

	.bankManage {
		margin-bottom: 0.3rem;
		.bankName {
			padding-bottom: 25px;
			font-size: 16px;
			color: #000000;
		}
	}


</style>
