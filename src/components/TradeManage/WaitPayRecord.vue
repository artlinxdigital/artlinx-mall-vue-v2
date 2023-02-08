<template>
	<div class="bg-head-table">
		<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" class="pcPage">
			<el-table-column prop="orderNo" label="Order number" width="150"></el-table-column>
			<el-table-column prop="remainTime" label="Expire" width="200">
				<template slot-scope="scope">
					{{scope.row.remainTime}}
					<div v-if="scope.row.toPayUrl">
						<a :href="scope.row.toPayUrl" target="_blank" title="Pay again" style="color: #000000;">
              Go to pay
						</a>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="orderType" label="Type" min-width="100">
				<template>
          Expenditure
				</template>
			</el-table-column>
			<el-table-column prop="orderStatus" label="Status">
				<template slot-scope="scope">
					<div v-if="scope.row.toPayUrl">
            To be paid
					</div>
					<div v-else>Timeout</div>
				</template>
			</el-table-column>
			<el-table-column prop="tradeAmount" label="Amount"> </el-table-column>
			<el-table-column prop="orderRemark" label="Remark"> </el-table-column>
		</el-table>
		<ul class="mPage">
			<li v-for="(item,index) in tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
				<div>
					<div class="orderNo">{{item.orderNo}}</div>
					<div class="orderType">Expenditure</div>
					<div class="remainTime">
						{{item.remainTime}}
					</div>
					<div class="orderStatus">
						<div v-if="item.toPayUrl">
							<a :href="item.toPayUrl" target="_blank" title="Pay again" style="color: #000000;">
								Go to pay
							</a>
						</div>
						<div v-else>Timeout</div>
					</div>
				</div>

				<div>
					<div class="tradeAmount"><i class="el-icon-minus"></i>{{item.tradeAmount}}</div>
					<div class="orderRemark">{{item.orderRemark}}</div>
				</div>
			</li>
		</ul>

		<!-- <div class="page-row">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" :pager-count="pagerCount" layout="total, prev, pager, next" :total="tableData.length">
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
		mounted() {this.getCurrentUser();
			// this.getChargeList();
			this.getMyToPay();
		},
		filters: {
			ellipsisAddress(value) {
				if(!value) return "";
				if(value.length > 10) {
					return `${value.substring(0, 6)}********${value.substring(value.length - 10)}`;
				}
				return value;
			},
		},
		methods: {
			handleSizeChange(val) {
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			// 查询用户待支付订单列表
			getMyToPay() {
				this.$API.getMyToPay({
					certificationId: window.localStorage.getItem("loginId")
				}).then(result => {
					// console.log("待支付订单列表：" + JSON.stringify(result));
					if(result.code !== 200) {
						this.common.notification(this, "Data loading failure", 3);
						return;
					}
					if(result.data !== null) {
						this.tableData = result.data.map(item => {
							return {
								...item,
								typeDesc: `${item.typeDesc} Recorded to indicates the balance `,
								address: `${this.$options.filters['ellipsisAddress'](item.address)}`,
								tradeAmount: `${item.tradeAmount.toFixed(2)}`
							}
						});
					}
				});
			},
			// 查询用户充值列表
			getChargeList() {
				this.$API.getChargeList({
					certificationId: window.localStorage.getItem("loginId")
				}).then(result => {
					if(result.code !== 200) {
						this.common.notification(this, "Data loading failure", 3);
						return;
					}
					if(result.data !== null) {
						this.total = result.data.length;
						this.tableData = result.data.map(item => {
							return {
								...item,
								typeDesc: `${item.typeDesc} Recorded to indicates the balance `,
								address: `${this.$options.filters['ellipsisAddress'](item.address)}`,
								money: `${item.money.toFixed(2)}`
							}
						});
					}
				});
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
		.address,
		.chargeTime,
		.chargeSource {
			font-size: 0.11rem;
		}
		.chargeSource {
			text-align: right;
		}
		i {
			font-size: 0.12rem;
			font-weight: 500;
			padding-right: 0.1rem;
		}
		.money {
			font-size: 0.18rem;
			font-weight: 500;
		}
	}
</style>
