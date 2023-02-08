<template>
  <div class="selectTab">
    <span
      class="selection"
      :class="{ active: item.productCategoryId === active }"
      v-for="item in selections"
      :key="item.productCategoryId"
      @click="handleClickItem(item.productCategoryId)"
      >{{ item.categoryName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    selections: Array,
    active: String,
  },
  methods: {
    handleClickItem (val) {
      this.$emit('update:active', val);
    },
  }
};
</script>

<style lang="less" scoped>
.selectTab {
  display: flex;
  align-items: center;
}
.selection {
  position: relative;
  margin-right: 0.5rem;
  font-size: 0.2rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  @media screen and (min-width: 800px) {
    font-size: 0.3rem;
  }
  &.active {
    font-size: 0.24rem;
    color: #1a1a1a;
    @media screen and (min-width: 800px) {
      font-size: 0.3rem;
    }
    &::after {
      position: absolute;
      content: "";
      width: 0.4rem;
      height: 0.06rem;
      background: #000000;
      border-radius: 0.03rem;
      bottom: -0.16rem;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
  }
}
</style>
