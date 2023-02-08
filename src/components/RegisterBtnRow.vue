<template>
	<div class="operateRow">
		<el-button type="primary" class="btnLogin" @click="$emit('register')">Sign up</el-button>
		<div class="loginRegTip">
			<span>Already have an account? </span>
			<router-link class="link" to="/login">Connect</router-link>
		</div>
	</div>
</template>

<script>
	export default {};
</script>

<style lang="less" scoped>
	.operateRow {
		font-size: 16px;
		@media screen and (max-width: 800px) {
			font-size: 0.16rem;
		}
	}
	.btnLogin {
		width: 100%;
		height: 40px;
		padding: 0;
		/deep/ span {
			font-size: 16px;
			@media screen and (max-width: 800px) {
				font-size: 0.16rem;
			}
		}
		@media screen and (max-width: 800px) {
			height: 0.4rem;
		}
	}
	.operateRow {
		margin-top: 30px;
		@media screen and (max-width: 800px) {
			margin-top: 0.3rem;
		}
	}
	.loginRegTip {
		color: #999999;
		margin-top:15px;
		span {
			font-size: 12px;


			}
		@media screen and (max-width: 800px) {
			text-align: center;
		span {
			font-size:0.12rem;
			}
		}
		.link {
			font-size: 12px;
			font-weight: bold;
			color: #000000;
			cursor: pointer;
			@media screen and (max-width: 800px) {
				font-size: 0.12rem;
			}
		}
	}
</style>
