<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <span class="el-dropdown-link">
      {{ showName }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item in dropdownTypes"
        :key="item.type"
        :command="item.type"
        :class="{activeDropMenu: item.type === dropdownType}"
      >{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    dropdownTypes: {
      type: Array,
      require: false,
      default: () => [
        {
          name: "price",
          type: "1",
        },
        {
          name: "time",
          type: "2",
        },
        {
          name: "Like",
          type: "3",
        },
        {
          name: "collect",
          type: "4",
        },
      ]
    }
  },
  data () {
    return {
      dropdownType: "",
      showName: 'Sort by',
    }
  },
  watch: {
    showName () {
      if (this.dropdownType) {
        const selectItem = this.dropdownTypes.find(item => item.type === this.dropdownType);
        return selectItem.name;
      }
      return 'Sort by';
    }
  },
  methods: {
    handleCommand(command) {
      this.dropdownType = command;
      this.showName = this.dropdownTypes.find(item => item.type === command).name;
      this.$emit('select', command);
    }
  }
};
</script>

<style lang="less" scoped>
 .el-dropdown-link {
 		font-size: 16px;
		color: #000000;
 		cursor: pointer;
	}

/deep/.activeDropMenu {
  background:#0089FF!important ;
}
.el-dropdown{color: #FFFFFF;}
	.el-dropdown-menu {
		color: #FFFFFF;
		padding: 10px;
		background: #13161F;
		border: 1px solid #464656;
		/deep/.popper__arrow {
			display: none;
		}
		.el-dropdown-menu__item {
			margin: 0;
			font-size: 14px;
			color: #FFFFFF;
			cursor: pointer;
			&:hover,
			.activeDropMenu {
				background: #0089FF;
				box-shadow: 0px 2px 8px 0px rgba(22, 21, 54, 0.5);
				border-radius: 4px;
			}
		}
	}
</style>
