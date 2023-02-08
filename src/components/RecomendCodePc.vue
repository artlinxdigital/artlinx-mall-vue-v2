<template>
	<el-dialog title="" class="emptyDialog" :visible="visible" :width="clientWidth > 800 ? '560px' : '90%'" :before-close="handleClose" :show-close="false" :destroy-on-close="false" center>
		<div class="contentInner">
			<RecomendCodeContent :realName="realName" :recommendCode="recommendCode" :avatar="avatar"/>
		</div>
	</el-dialog>
</template>

<script>
	import RecomendCodeContent from "@/components/RecomendCodeContent";

	export default {
		props: {
			visible: Boolean,
			realName: String,
			recommendCode: String,
			avatar: String
		},
		components: {
			RecomendCodeContent
		},
		data() {
			return {

				clientWidth: 750,

			};
		},
		mounted() {this.getCurrentUser();
			this.$nextTick(() => {
				this.clientWidth = document.documentElement.clientWidth;
			});
		},
		methods: {
			handleClose() {
				this.$emit('close');
			},
		}
	}
</script>

<style lang="less" scoped>
	.contentInner {
		padding: 13px 0 30px;
		border-radius: 16px;
		background: #fff;
		@media screen and (max-width: 800px) {
			padding: 0;
			background: none;
		}
	}
</style>