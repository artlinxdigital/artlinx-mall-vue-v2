<template>
  <div class="sort" @click="toggleSortType">
    {{isUp ? 'ascending' : 'descending'}}
    <span class="iconCaret">
      <i class="sortCaret ascending" :class="{active: isUp}"></i>
      <i class="sortCaret descending" :class="{active: !isUp}"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    isUp: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  methods: {
    toggleSortType () {
      this.$emit("update:isUp", !this.isUp);
      this.$emit('sort', !this.isUp)
    }
  }
}
</script>

<style lang="less" scoped>
.sort {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  .iconCaret {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height:20px;
    width: 20px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
    .sortCaret {
      position: absolute;
      width: 0;
      height: 0;
      border:9px solid  transparent;
      left:6px;
      @media screen and (min-width: 800px) {
        border:6px solid  transparent;
      }
      &.ascending {
        border-bottom-color: #707070;
        top: -9px;
        @media screen and (min-width: 800px) {
          top: -2px;
        }
        &.active {
          border-bottom-color: #000000;
        }
      }
      &.descending {
        border-top-color: #707070;
        bottom: -8px;
        @media screen and (min-width: 800px) {
          bottom: -5px;
        }
        &.active {
          border-top-color: #000000;
        }
      }
    }
    i.active {
      color: #000000;
    }
    .el-icon-caret-top {
      position: absolute;
      top: 0;
    }
    .el-icon-caret-bottom {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
