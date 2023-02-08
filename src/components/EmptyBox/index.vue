<template>
  <div class="empty">
    <div class="emptyIn">
      <!-- <div class="emptyImg"></div> -->
      <!-- <i class="el-icon-box iconEmpty" v-if="showIcon"></i> -->
<!--      <div class="emptyImg" v-if="showIcon"></div>-->
      <span>{{ title }}</span>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'No data',
      required: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style lang="less" scoped>
.flxcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty {
  width: 100%;
  height: 100%;
  .flxcenter();
  color: #999999;
}
.emptyIn {
  .flxcenter();
  flex-direction: column;
  span {
    font-size: 0.14rem;
  }

  .iconEmpty {
    margin-bottom: 0.2rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
  }
}
.emptyImg {
  width: 306px;
  height: 206px;
  margin: 0 auto;
  //background: url('../../assets/images/que_shuju@2x.png') no-repeat center;
  background-size: contain;
  text-align: center;
  @media screen and (max-width: 800px) {
    width:2rem;
    height: 1.5rem;
    margin: 0 auto;
    background-size: 2rem 1.5rem;
  }

}
</style>
