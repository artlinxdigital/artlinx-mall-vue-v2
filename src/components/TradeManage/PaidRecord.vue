<template>
	<div class="bg-head-table">
		<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" class="pcPage">
			<el-table-column prop="id" label="Order number" width="150"> </el-table-column>
			<el-table-column prop="createTime" label="Expire" width="160"> </el-table-column>
			<el-table-column prop="tradeTypeDesc" label="Type"> </el-table-column>
			<el-table-column prop="statusDesc" label="Status"> </el-table-column>
			<el-table-column prop="money" label="Amount"> </el-table-column>
			<el-table-column prop="orderRemark" label="Remark"> </el-table-column>
		</el-table>
		<ul class="mPage">
			<li v-for="(item,index) in tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
				<div>
					<div class="id">{{item.id}}</div>
					<div class="orderRemark">{{item.orderRemark}}</div>
					<div class="createTime">{{item.createTime}}</div>
				</div>

				<div>
					<div class="money">
						<i class="el-icon-minus" v-if="item.tradeTypeDesc == '支出'"></i>
						<i class="el-icon-plus" v-else></i>
						{{item.money}}
					</div>
					<div class="statusDesc">{{item.statusDesc}}</div>
				</div>
			</li>
		</ul>

		<!-- <div class="page-row">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="pagerCount" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="tableData.length">
			</el-pagination>
		</div> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				currentPage: 1,
				pageSize: 500,
				total: 0,
				pagerCount: 500,
			};
		},
		filters: {
			ellipsisBankCard(value) {
				if(!value) return "";
				if(value.length > 10) {
					return `${value.substring(0, 3)}********${value.substring(value.length - 4)}`;
				}
				return value;
			},
			ellipsisBankCardSuffix(value) {
				if(!value) return "";
				if(value.length > 10) {
					return `${value.substring(value.length - 4)}`;
				}
				return value;
			},
		},
		mounted() {this.getCurrentUser();
			// 提现列表
			// this.getWithdrawList();
			// 交易记录列表
			this.getMoneyHistory();
		},
		methods: {
			handleSizeChange(val) {
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			// 查询用户交易记录
			getMoneyHistory() {
				this.$API.getMoneyHistory({
					certificationId: window.localStorage.getItem("loginId")
				}).then(result => {
					// console.log("交易记录列表：" + JSON.stringify(result));
					if(result.code !== 200) {
						this.common.notification(this, "Data loading failure", 3);
						return;
					}
					if(result.data !== null) {
						this.tableData = result.data.map(item => {
							return {
								...item,
								withdrawGoal: `Charge Off到-(${item.withdrawGoal})`,
								withdrawAccount: `${this.$options.filters['ellipsisBankCard'](item.withdrawAccount)}`,
								money: `${item.money.toFixed(2)}`
							}
						});
					}
				});
			},
			// 查询用户提现列表
			getWithdrawList() {
				this.$API.getWithdrawList({
					certificationId: window.localStorage.getItem("loginId")
				}).then(result => {
					if(result.code !== 200) {
						this.common.notification(this, "Data loading failure", 3);
						return;
					}
					if(result.data !== null) {
						this.tableData = result.data.map(item => {
							return {
								...item,
								withdrawGoal: `Charge Off到-(${item.withdrawGoal})`,
								withdrawAccount: `${this.$options.filters['ellipsisBankCard'](item.withdrawAccount)}`,
								withdrawAmount: `${item.withdrawAmount.toFixed(2)}`
							}
						});
					}
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		},
	};
</script>

<style lang="less" scoped>
	.bg-head-table {
		/deep/.el-table,
		/deep/ .el-table th,
		/deep/.el-table tr {
			border: none!important;
			background: none;
		}
	}

	/deep/.el-table__row:hover>td {
		background: none!important;
		transform: scale(1.1);
	}

	/deep/.el-table tr div {
		font-size: 12px;
	}

	/deep/.el-table .has-gutter tr div {
		font-size: 14px;
	}

	/deep/.el-table__header-wrapper {
		background: rgba(255, 255, 255, 0.06);
		border-radius: 8px;
	}

	/deep/.el-table td,
	/deep/.el-table th.is-leaf {
		border: none;
		color: #000000;
	}

	/deep/.number,
	/deep/.more,
	/deep/.btn-next,
	/deep/.btn-prev {
		background: rgba(255, 255, 255, 0.06)!important;
		@media screen and (max-width: 370px) {
			margin:0 3px!important;
		}
	}

	@media screen and (max-width:400px) {
		/deep/.el-pagination__total {
			display: none!important;
		}
	}

	/deep/.number.active {
		background: #000000!important;
	}

	.page-row {
		margin: 0.3rem 0;
		text-align: right;
	}

	li {
		background: rgba(255, 255, 255, 0.06);
		border-radius: 0.08rem;
		margin-bottom: 0.1rem;
		padding: 0.1rem;
		display: flex;
		justify-content: space-between;
		div {
			line-height: 0.3rem;
		}
		.withdrawAccount,
		.withdrawTime,
		.statusDesc {
			font-size: 0.11rem;
		}
		.statusDesc {
			text-align: right;
		}
		i {
			font-size: 0.12rem;
			font-weight: 500;
			padding-right: 0.1rem;
		}
		.withdrawAmount {
			font-size: 0.18rem;
			font-weight: 500;
		}
	}
</style>
