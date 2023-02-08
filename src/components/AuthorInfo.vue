<template>
  <div class="authorInfo">
    <div class="authInfoTop">
      <span class="imgLt"></span>
      <div class="userAvatar">
        <!-- <div class="avatarBox">
          <el-image
            class="avatarImg"
            :src="'/prod-api'+ info.avatarUrl"
            fit="cover"
          ></el-image>
		  <el-image
            class="avatarImg"
            :src="avatarUrl"
            fit="cover"
          ></el-image>
        </div> -->
        <span>{{info.productAuthor}}</span>
      </div>
      <span class="imgRt"></span>
    </div>
    <p class="smTxt">About The Artist：</p>
    <p class="authorIntro">{{(info.productAuthorDesc == null || info.productAuthorDesc == '') ? 'No data' : info.productAuthorDesc}}</p>
    <div class="btnRow">
      <el-button class="btnTheme" @click="$emit('close')">
        I see</el-button>
    </div>
  </div>
</template>

<script>
import API from "@/service/index";
export default {
  props: {
    info: Object
  },
  filters: {
    ellipsisNickName(value) {
        if (!value) return "";
        if ( value.length > 4) {
            if (value.length > 8) {
              return `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
            }
            return `${value.substring(0, 2)}****${value.substring(value.length - 2)}`;
        }
        return value;
    }
  },
  data() {
    return {
      avatarUrl: API.getDefaultAvatarUrl()
    }
  }
};
</script>

<style lang="less" scoped>
.authorInfo {
		position: relative;
		padding: 0.52rem 0.31rem 0.48rem;
		background:#ffffff;
    color:#000000;
		border-radius: 0.2rem;
	}

	.authInfoTop {
		display: flex;
		justify-content: space-between;
	}

	.imgLt {
		width: 1rem;
		height: 0.94rem;
		background: url('../assets/images/xing2@2x.png') no-repeat left;
		background-size: 1rem 0.94rem;
	}

	.imgRt {
		width: 1rem;
		height: 0.94rem;
		background: url('../assets/images/xing@2x.png') no-repeat right;
		background-size: 1rem 0.94rem;
	}

	@media screen and (max-width: 800px) {
		.imgLt,
		.imgRt {
			width: 0.5rem;
			height: 0.47rem;
			background-size: 0.5rem 0.47rem;

	}
}
.userAvatar {
	margin-bottom: 0.1rem;
	text-align: center;
	font-size: 0.28rem;
	color: #000000;
	@media screen and (max-width: 800px) {
		margin-bottom: 0.3rem;
	}

	span {
		font-size: 0.18rem;
		@media screen and (max-width: 800px) {
			font-size: 0.14rem;
		}
	}
}
.avatarBox {
	width: 1.2rem;
	height: 1.2rem;
	margin-bottom: 0.1rem;
	padding: 0.08rem;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 100%;
	@media screen and (max-width: 800px) {
		width:0.7rem;
		height: 0.7rem;
		margin-bottom: 0.17rem;
	}

	.avatarImg {
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
}
.smTxt {
	margin-bottom: 0.27rem;
	font-size: 0.18rem;
	color: #000000;
	@media screen and (max-width: 800px) {
		font-size: 0.14rem;
	}
}
.authorIntro {
	max-height: 1.3rem;
	margin-bottom: 0.49rem;
	font-size: 0.16rem;
	color: #000000;
	line-height: 0.25rem;
	overflow-y: auto;
	@media screen and (max-width: 800px) {
		font-size: 0.12rem;
		line-height: 0.2rem;
	}
}
.btnRow {
	text-align: center;
	.btnTheme {
		width: 3.8rem;
		border-radius: 0.04rem;
		color: #000000;
		@media screen and (max-width: 800px) {
			border-radius: 0.08rem;
			width:100%;
		}
		/deep/ span {
			font-size: 0.18rem;
			@media screen and (max-width: 800px) {
				font-size: 0.14rem;
			}
		}
	}
}
</style>
