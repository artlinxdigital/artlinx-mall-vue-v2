<template>
  <div class="sort" @click="toggleSortType">
    {{title}}
    <span class="iconCaret">
      <i class="sortCaret ascending" :class="{active: (isActive && (isUp === true))}"></i>
      <i class="sortCaret descending" :class="{active: (isActive && (isUp === false))}"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    isUp: {
      type: Boolean
    },
    title: {
      type: String,
      require: true,
    },
    isActive: Boolean
  },
  methods: {
    toggleSortType () {
      this.$emit("update:isUp", !this.isUp);
    }
  }
}
</script>

<style lang="less" scoped>
.sort {
  display: flex;
  align-items: center;
  margin-left: 0.02rem;
  color: #000000;
  cursor: pointer;
  .iconCaret {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 0.22rem;
    width: 0.22rem;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
    .sortCaret {
      position: absolute;
      width: 0;
      height: 0;
      border: solid 0.05rem transparent;
      left: 0.06rem;
      &.ascending {
        border-bottom-color: #C4C4C4;
        top:-0.01rem;
        &.active {
          border-bottom-color: #707070;
        }
      }
      &.descending {
        border-top-color: #C4C4C4;
        bottom:-0.01rem;
        &.active {
          border-top-color: #707070;
        }
      }
    }
    i.active {
      color: #707070;
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
