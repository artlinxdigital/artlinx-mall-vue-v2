<template>
  <el-input
    v-model.trim="val"
    :placeholder="placeholder"
    @input="input"
    @change="change"
  >
    <el-select
      v-model="coin"
      slot="prepend"
      @change="updateCoin"
      placeholder="请选择"
    >
      <el-option
        v-for="(item, index) in coinArr"
        :label="item.name"
        v-bind:key="index"
        :value="item.address"
      ></el-option>
      <!-- <el-option label="USDC(ERC20)" value="2"></el-option>
      <el-option label="DIV(ERC20)" value="3"></el-option> -->
    </el-select>
    <!-- <el-dropdown slot="prepend" class="el-input__icon">
      <span class="el-dropdown-link">
        RMB<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>RMB</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
  </el-input>
</template>

<script>
import { constractAddress, config } from "@/const/const";
export default {
  name: "NumberInput",
  props: {
    placeholder: {
      type: String,
      default: "please input...",
    },
    value: {
      //默认值
      type: undefined, //undefined表示能通过任何类型
      default: "0",
    },
    decimal: {
      //控制小数位数，默认是2位
      type: Number,
      default: 2,
    },
  },
  model: {
    prop: "value", //传递的值(文本框的value)
    event: "change", // 定义的事件
  },
  data() {
    return {
      val: this.value,
      coinArr: [],
      coin: "",
    };
  },
  mounted() {this.getCurrentUser();
    this.coinArr = constractAddress.coinType;
    this.coin = this.coinArr[0].address;
    if (this.value) {
      //判断初始值是否是正常的浮点数，并进行处理
      this.val = this.handelValue(this.value);
      this.change();
    }
  },
  methods: {
    updateCoin(index) {
      console.log("index", index);
      this.$emit("updateCoin", this.coin);
    },
    //input
    input() {
      this.val = this.handelValue(this.val);
      this.$emit("input", this.val);
    },

    //处理输入的值，go back数字和小数点
    handelValue(value) {
      return value
        .replace(/[^\d.]/g, "") //控制只能输入小数点或者数字
        .replace(/\.{2,}/g, ".") //控制只能有一个连续的小数点
        .replace(".", "_") //将第一个小数点替换成其他字符
        .replace(/\./g, "") //将其他小数点设置为空字符串
        .replace("_", ".") // 最后将其他字符替换成小数点
        .replace(
          new RegExp(`^(-)*(\\d+)\\.(\\d{${this.decimal}}).*$`),
          "$1$2.$3"
        ); //控制小数点的位数(decimal)默认是最多两位
    },
    //change
    change() {
      this.val = this.fillZero(this.val);
      //通过$emit触发model内定义的change事件，将内部值传递给给父组件
      this.$emit("change", this.val);
    },
    //更改后小数位数自动添加0
    fillZero(value) {
      const dotIdxLocate = String(value).indexOf(".") + 1;
      if (dotIdxLocate > 0) {
        const count = String(value).length - dotIdxLocate;
        const matchVal = String(value).substring(dotIdxLocate);
        if (count !== this.decimal) {
          value = value.replace(
            /\..*$/,
            `.${matchVal.padEnd(this.decimal, "0")}`
          );
        }
      } else {
        if (value != "" || value != 0) {
          value = `${value}.${new Array(this.decimal).fill("0").join("")}`;
        }
      }
      // //判断有没有小数点
      // if (/(?<=\.)\d*$/g.test(value)) {
      //   //判断小数点位数是否与decimal值相等
      //   if (value.match(/(?<=\.)\d*$/g)[0].length != this.decimal) {
      //     //匹配小数点和其后面所有数字，然后在后面填充0
      //     value = value.replace(
      //       /\..*$/,
      //       `.${value.match(/(?<=\.)\d*$/g)[0].padEnd(this.decimal, "0")}`
      //     );
      //   }
      // } else {
      //   if(value != '' || value != 0){
      //   value = `${value}.${new Array(this.decimal).fill("0").join("")}`;
      //   //利用数组填充方法填充字符串，如果有更好的方法评论区里请告诉我
      //   }
      // }
      return value;
    },
  },
};
</script>

<style lang="less" scoped></style>
