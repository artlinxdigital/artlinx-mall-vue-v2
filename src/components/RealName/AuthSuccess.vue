<template>
	<div class="pageContainer authSuccess">
		<img class="fl" src="../../assets/images/successIco.png" />

		<div class="subTitle fl">
			<p class="successTxt">You have passed the real-name authentication</p>
			<p>Nice to meet you. Now you can enjoy more service and protection</p>
		</div>
		<div class="clear"></div>
		<div class="userInfor">
			<div class="title">Your identity information</div>
			<el-form :model="form" label-width="auto">
				<el-form-item label="Real Name:">
					<el-input v-model="form.realName" readonly></el-input>
				</el-form-item>
				<el-form-item label="ID number:">
					<el-input v-model="form.number" readonly></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import API from '@/service/index';
	import { faceAuthErrMsg } from '@/utils/rules';

	export default {
		components: {},
		data() {
			return {
				errMsssage: "",
				code: -1,
				form: {
					realName: '',
					number: '',
					mobile: '',
				}
			};
		},
		mounted() {this.getCurrentUser();
			this.code = this.$route.query.code;
			console.log("query: " + JSON.stringify(this.$route.query));
			console.log("code: " + this.code);
			this.toPersonalCenter();
		},
		methods: {

			// 查看
			toPersonalCenter() {
				API.getUserInfo({
					certificationId: window.localStorage.getItem("loginId")
				}).then(res => {
					this.form = {
						realName: res.data.realName,
						number: this.$options.filters['ellipsisIdCard'](res.data.number),
						mobile: this.$options.filters['ellipsisAccount'](res.data.mobile),
					};
					this.dialogVisible = true;
				});

			},
			handleClose() {
				this.dialogVisible = false;
			},
			initInfo() {
				API.getUserInfo({
					certificationId: window.localStorage.getItem("loginId")
				}).then(res => {
					this.form = {
						realName: res.realName,
						number: this.$options.filters['ellipsisIdCard'](res.data.number),
						mobile: this.$options.filters['ellipsisAccount'](res.data.mobile),
					};
				}).catch(err => {
					console.error(err);
				});
			}
		},
		filters: {
			ellipsisIdCard(value) {
				if(!value) return "";
				if(value.length > 10) {
					return `${value.substring(0, 3)}********${value.substring(value.length - 4)}`;
				}
				return value;
			},
			ellipsisAccount(value) {
				if(!value) return "";
				if(value.length > 10) {
					return `${value.substring(0, 3)}****${value.substring(value.length - 4)}`;
				}
				return value;
			}
		},
	}
</script>

<style lang="less" scoped>
	.stepResult img {
		width: 2.01rem;
		height: 1.63rem;
		margin: 0 auto;
	}

	.subTitle {
		text-align: center;
		padding: 0;
		color: rgba(255, 255, 255, 0.8);
		p {
			font-size: 0.12rem;
			color: #B0B0B0;
			&.successTxt {
				margin-bottom: 0.3rem;
				font-size: 0.16rem;
				color: #000000;
				font-weight: 500;
			}
		}
	}

	.authSuccess {
		text-align: center;
		position: relative;
	}

	.fl {
		float: none;
	}

	.userInfor {
		margin-top: 0.3rem;
		font-size: 0.16rem;
		background: rgba(255, 255, 255, 0.06);
		text-align: left;
		padding: 0.15rem 0.3rem;
		border-radius: 0.16rem;
		.title {
			font-size: 0.16rem;
			line-height: 0.5rem;
		}
		/deep/input.el-input__inner {
			background: none;
			box-shadow: none;
		}
		@media screen and (min-width: 800px) {
			margin-top: 30px;
			font-size: 16px;
			padding: 15px 30px;
			border-radius: 16px;
			.title {
				font-size: 16px;
				line-height: 50px;
			}
			/deep/.el-form-item__label{font-size:14px ;}
		}
	}

	/deep/.el-form-item {
		margin-bottom: 30px;
	}

	/deep/.el-form-item__content,
	/deep/.el-form-item__label,
	/deep/.el-input__inner {
		line-height: 0.35rem;
		height: 0.35rem;
	}

	/deep/.el-form-item__label,
	/deep/.el-input {
		font-size: 0.14rem;
	}
</style>
