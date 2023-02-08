import Vue from "vue";
import "@/assets/theme/index.css";
import API from "@/service/index";
import App from "./App.vue";
import router from "./router";
import "./assets/less/common.less";
import common from "./common/common";
import sm4 from "./sm/sm4/sm4";
import vfilter from "./utils/vfilters/filters";
import VueLazyload from "vue-lazyload";
import store from "./store";
import {isUK} from "@/utils/rules";
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  // InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  // Switch,
  Select,
  Option,
  // OptionGroup,
  Button,
  // ButtonGroup,
  Table,
  TableColumn,
  Popover,

  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  // Icon,
  Row,
  Col,
  Upload,
  // Progress,
  // Spinner,
  // Badge,
  // Card,
  // Rate,
  // Steps,
  // Step,
  Carousel,
  CarouselItem,
  // Collapse,
  // CollapseItem,
  // Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer,
  // Timeline,
  // TimelineItem,
  // Link,
  Divider,
  Image,
  // Calendar,
  // Backtop,
  // PageHeader,
  // CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Notification,
  Drawer,
  // Avatar,
  Descriptions,
  DescriptionsItem,
} from "element-ui";
import Meta from "vue-meta";
import VueClipboards from "vue-clipboard2";
import locale from "../node_modules/element-ui/lib/locale/lang/en";
Vue.use(VueClipboards, { locale });
Vue.use(Meta, { locale }); //注册使用vue-meta模块
Vue.use(Pagination, { locale });
Vue.use(Dialog, { locale });
Vue.use(Autocomplete);
Vue.use(Dropdown, { locale });
Vue.use(DropdownMenu, { locale });
Vue.use(DropdownItem, { locale });
Vue.use(Menu, { locale });
Vue.use(Submenu, { locale });
Vue.use(MenuItem, { locale });
Vue.use(MenuItemGroup, { locale });
Vue.use(Input, { locale });
// Vue.use(InputNumber);
Vue.use(Radio, { locale });
Vue.use(RadioGroup, { locale });
Vue.use(RadioButton, { locale });
Vue.use(Checkbox, { locale });
// Vue.use(CheckboxButton);
// Vue.use(CheckboxGroup);
// Vue.use(Switch);
Vue.use(Select, { locale });
Vue.use(Option, { locale });
// Vue.use(OptionGroup);
Vue.use(Button, { locale });
// Vue.use(ButtonGroup, { locale });
Vue.use(Table, { locale });
Vue.use(TableColumn, { locale });
// Vue.use(DatePicker);
// Vue.use(TimeSelect);
// Vue.use(TimePicker);
Vue.use(Popover, { locale });
Vue.use(Tooltip, { locale });
Vue.use(Breadcrumb, { locale });
Vue.use(BreadcrumbItem, { locale });
Vue.use(Form, { locale });
Vue.use(FormItem, { locale });
Vue.use(Tabs, { locale });
Vue.use(TabPane, { locale });
Vue.use(Tag, { locale });
// Vue.use(Alert);
// Vue.use(Slider);
// Vue.use(Icon);
Vue.use(Row, { locale });
Vue.use(Col, { locale });
Vue.use(Upload, { locale });
// Vue.use(Progress);
// Vue.use(Spinner);
// Vue.use(Badge);
// Vue.use(Steps);
// Vue.use(Step);
Vue.use(Carousel, { locale });
Vue.use(CarouselItem, { locale });
// Vue.use(Transfer);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
// Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Timeline);
// Vue.use(TimelineItem);
// Vue.use(Link);
Vue.use(Divider, { locale });
Vue.use(Image, { locale });
// Vue.use(Backtop);
// Vue.use(PageHeader);
Vue.use(Drawer, { locale });
// Vue.use(Avatar);
Vue.use(Descriptions, { locale });
Vue.use(DescriptionsItem, { locale });

Vue.use(Loading.directive);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require("./assets/images/load_err.jpg"),
  loading: require("./assets/images/artlinx_loading.jpg"),
  dispatchEvent: true,
  attempt: 5,
});
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.common = common;
Vue.prototype.$sm4 = sm4;
Vue.prototype.$API = API;
Vue.prototype.$store = store;
Vue.prototype.isUK = isUK;
console.log("---beforeMount---");
Vue.prototype.$store.dispatch("wallet/connectWallet", true);
Vue.prototype.getCurrentUser = function () {
  let selectedWallet = window.localStorage.getItem("selectedWallet");
  if ("walletconnect" == selectedWallet) {
    if (window.localStorage.getItem("walletconnect") == undefined) {
      window.localStorage.clear();
      router.replace({
        path: "/login",
      });
    }
  }
  fetch("https://gasstation-mainnet.matic.network/").then((res) => {
    res.json().then((result) => {
      // console.log("networkFee:", result);
      window.localStorage.setItem("networkFee", result.fastest);
    });
  });

  const walletAddress = window.localStorage.getItem("walletAddress");
  const href = window.location.href;
  let walletitem = window.localStorage.getItem("walletitem");
  // console.log("main walletAddress:", walletAddress);
  if (!href.endsWith("/")) {
    if (!walletAddress || walletAddress == "") {
      if (href.indexOf("/collection/") == -1) {
        router.replace({
          path: "/login",
        });
        return;
      } else {
        return null;
      }
    } else {
      return JSON.parse(walletitem);
    }
  }
};
Vue.prototype.parseHttp = (value) => {
  if (value == undefined) {
    return;
  }
  if (value && value.substr(0, 4) == "http") {
    console.log("img:", value);
    return value;
  } else {
    console.log("img:", API.getIpfsAccessPrefix() + value);
    return API.getIpfsAccessPrefix() + value;
  }
};
Vue.prototype.getUserInfo = (isUpdate = false) => {
  return new Promise((resolve, reject) => {
    const userInfo = sessionStorage.getItem("userInfo");

    if (!userInfo || isUpdate) {
      API.getUserInfo({
        certificationId: window.localStorage.getItem("loginId"),
      }).then((result) => {
        if (result.code !== 200) {
          this.common.notification(this, "Data loading failure", 3);
          reject();
          return;
        }
        const info = result.data;
        sessionStorage.setItem("userInfo", JSON.stringify(info));
        resolve(info);
      });
    } else {
      resolve(JSON.parse(userInfo));
    }
  });
};

Vue.prototype.getPrivateKey = function () {
  const enPass = sessionStorage.getItem("enPass");
  const encryPri = sessionStorage.getItem("encryPri");
  let decrypt = "";
  try {
    if (enPass && encryPri) {
      decrypt = this.$sm4.decrypt_ecb(encryPri, enPass);
    }
  } catch (e) {
    console.log(e);
  }
  return decrypt;
  // return sessionStorage.getItem("privateKey");
};

for (let key in vfilter) {
  Vue.filter(key, vfilter[key]);
}

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
