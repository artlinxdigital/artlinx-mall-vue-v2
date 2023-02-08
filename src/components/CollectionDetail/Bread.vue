<template>
  <div class="bread">
    <span class="lightBread breadLink" @click="$router.push('/')">Home / </span>
    <span class="lightBread">{{ productCategoryName }} / </span>
    <span>{{ productName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    productCategoryName: String,
    productName: String,
  }
};
</script>

<style lang="less" scoped>
.bread {
  margin: 0 auto;
  color: #000000;
  @media screen and (max-width: 800px) {
    display: none;
  }
  .lightBread {
    color: rgba(0, 0, 0, 0.6);
  }
  .breadLink {
    cursor: pointer;
    &:hover {
      color: #000000;
    }
  }
}
</style>
