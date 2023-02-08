<template>
	<div class="container">
		<MPersonalCenterLayout activeKey="2-1">
			<div class="innerContent">
				<!-- <AccountBankCard :balance="balance" :userStatus.sync="userStatus" /> -->

				<div class="bankManage">
					<!-- <span class="bankName">Bank card</span> -->
				</div>
				<!-- <BankCards /> -->
				<!-- <h3 class="subTitle" >Card setting</h3> -->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="Pending Clearing" name="charge">
						<WaitPayRecord />
					</el-tab-pane>
					<el-tab-pane label="Paid out" name="withdraw">
						<PaidRecord />
					</el-tab-pane>
				</el-tabs>
			</div>
		</MPersonalCenterLayout>
		 <homefooter/>
	</div>
</template>

<script>
	import MPersonalCenterLayout from "@/components/MPersonalCenterLayout";
	import WaitPayRecord from "@/components/TradeManage/WaitPayRecord";
	import PaidRecord from "@/components/TradeManage/PaidRecord";
	import BankCards from "@/components/TradeManage/BankCards";
	import AccountBankCard from "@/views/PersonalCenter/AcountBalanceCard";
	import homefooter from "./HomeFooter";
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
			MPersonalCenterLayout,
			AccountBankCard,
			WaitPayRecord,
			PaidRecord,
			BankCards,
			homefooter,
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
				this.balance = res.data.balance;
			}).catch(err => {
				console.error(err);
			});
			// 查询地址余额
			// this.getUserBalance();
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
		min-height: 100vh;position: relative;
	}
	.bankManage{
		margin-top:50px ;
	}

	.innerContent {
		min-height: 80vh;
	}

	.subTitle {
		font-size:0.16rem;
		margin-bottom:0.2rem;
	}
	/deep/.el-tabs__nav-wrap::after {
		display: none;
	}
	/deep/.el-table::before {
		display: none;
	}
	/deep/ .el-tabs__item {
		// min-width:1rem;
		height:0.32rem;
		line-height:0.32rem;
		text-align: center;
		border-radius:0.16rem;
		color: #000000;
    border:1px solid #000000;  
		padding: 0 15px!important;
		background: rgba(255, 255, 255, 0.1);
		margin:0 0.15rem 0.13rem 0;
		font-size: 0.14rem;
		&.is-active {
			background: #000000;
      color:#ffffff;
		}
	}

	/deep/.el-tabs__active-bar.is-top {
		display: none;
	}

	.bankManage {
		margin-bottom: 0.3rem;
		.bankName {
			padding-bottom: 0.25rem;
			font-size:0.16rem;
			color: #000000;
		}
	}


</style>
