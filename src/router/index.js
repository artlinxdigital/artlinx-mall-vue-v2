import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PcHome from "../pcviews/Home.vue";

Vue.use(VueRouter);

const clientWidth = document.documentElement.clientWidth;
var resizeTimer = null;
window.onresize = function () {
  let windowWidth = document.body.clientWidth;
  //解决手机qq浏览器登录页不断刷新加判断
  if (windowWidth >= 400) {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      location.reload();
    }, 500);
  }
};
//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      title: "Artlinx-Global Digital Art Trading Platform",
    },
    component: clientWidth < 800 ? Home : PcHome,
  },
  {
    path: "/collections",
    name: "Collections",
    meta: {
      title: "Artlinx- List of goods",
    },
    component: () =>
      import(/* webpackChunkName: "collections" */ "../views/Collections.vue"),
  },
  {
    path: "/collection/:id",
    name: "Collection",
    meta: {
      title: "Artlinx - goods",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../pcviews/ProductDetail.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Artlinx - Connect",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      title: "Artlinx - registered",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/Register.vue"),
  },
  {
    path: "/withdraw",
    name: "Withdraw",
    meta: {
      title: "Artlinx- Request for withdrawal",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/WithDraw.vue");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/Withdraw.vue");
      }
    },
  },
  {
    path: "/withdraw-setting",
    name: "WithdrawSetting",
    meta: {
      title: "Artlinx- Withdrawal Settings",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/WithDrawSetting.vue"),
  },
  {
    path: "/funding-records",
    name: "FundingRecord",
    meta: {
      title: "Artlinx- Financial records",
    },
    component: () =>
      import(
        /* webpackChunkName: "user" */ "../views/FundingRecords/index.vue"
      ),
  },
  {
    path: "/personal",
    name: "PersonalCenter",
    meta: {
      title: "Artlinx-Profile",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/PersonalCenter");
      } else {
        return import(
          /* webpackChunkName: "user" */ "../pcviews/PersonalCenter"
        );
      }
    },
  },
  {
    path: "/realname",
    name: "RealNameAuth",
    meta: {
      title: "Artlinx- Real name authentication",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/RealNameAuth");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/Realname");
      }
    },
  },
  {
    path: "/realname-info",
    name: "RealNameInfo",
    meta: {
      title: "Artlinx- Real name authentication",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/RealNameInfo"),
  },
  {
    path: "/face",
    name: "FaceRecognition",
    meta: {
      title: "Artlinx-Face Recognition",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/FaceRecognition"),
  },
  {
    path: "/auth-success",
    name: "AuthSuccess",
    meta: {
      title: "Artlinx- Authentication succeeded",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/AuthSuccess"),
  },
  {
    path: "/auth-fail",
    name: "AuthFail",
    meta: {
      title: "Artlinx- Authentication failed",
    },
    component: () => import(/* webpackChunkName: "user" */ "../views/AuthFail"),
  },
  {
    path: "/recomend",
    name: "MyRecomend",
    meta: {
      title: "Artlinx-Referral Code",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/MyRecomend"),
  },
  {
    path: "/add-bank",
    name: "AddBankCard",
    meta: {
      title: "Artlinx-add bank card",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/AddBankCard");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/AddBankCard");
      }
    },
  },
  {
    path: "/casting",
    name: "Casting",
    meta: {
      title: "Artlinx - casting",
    },
    component: () =>
      import(/* webpackChunkName: "casting" */ "../pcviews/Molding"),
  },
  {
    path: "/importMolding",
    name: "ImportMolding",
    meta: {
      title: "Artlinx - import",
    },
    component: () =>
      import(
        /* webpackChunkName: "ImportMolding" */ "../pcviews/ImportMolding"
      ),
  },
  {
    path: "/favorites",
    name: "Favorites",
    meta: {
      title: "Artlinx-Create favorites",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "casting" */ "../views/Favorites");
      } else {
        return import(/* webpackChunkName: "casting" */ "../pcviews/Favorites");
      }
    },
  },
  {
    path: "/pay-success",
    name: "PaySuccess",
    meta: {
      title: "Artlinx-pay success",
    },
    component: () =>
      import(/* webpackChunkName: "casting" */ "../pcviews/TradeSuccess"),
  },
  {
    path: "/pay-fail",
    name: "PaySuccess",
    meta: {
      title: "Artlinx-Payment Failed",
    },
    component: () =>
      import(/* webpackChunkName: "casting" */ "../pcviews/PayFail"),
  },
  {
    path: "/charge",
    name: "Charge",
    meta: {
      title: "NFT - prepaid phone",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/Charge");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/Charge");
      }
    },
  },
  {
    path: "/my-collections",
    name: "MyCollections",
    meta: {
      title: "Artlinx-My favorites",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/MyCollections");
      } else {
        return import(
          /* webpackChunkName: "user" */ "../pcviews/MyCollections"
        );
      }
    },
  },
  {
    path: "/owner",
    name: "Owner",
    meta: {
      title: "Artlinx - I own it",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/owner");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/owner");
      }
    },
  },
  {
    path: "/order",
    name: "Order",
    meta: {
      title: "Artlinx-My trading",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/Order");
      } else {
        return import(/* webpackChunkName: "user" */ "../pcviews/Order");
      }
    },
  },
  // {
  //   path: "/team",
  //   name: "MyTeam",
  //   meta: {
  //     title: "Artlinx-My Team",
  //   },
  //   component: () => import(/* webpackChunkName: "user" */ "../views/MyTeam"),
  // },
  {
    path: "/edit-nickname",
    name: "EditNickName",
    meta: {
      title: "Artlinx-Change nickname",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/EditNickName.vue"),
  },
  {
    path: "/edit-desc",
    name: "EditDesc",
    meta: {
      title: "Artlinx-Change introduction",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/EditDesc.vue"),
  },
  {
    path: "/edit-info",
    name: "EditInfo",
    meta: {
      title: "Artlinx-Edit data",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/EditInfo.vue"),
  },
  {
    path: "/setting",
    name: "Setting",
    meta: {
      title: "Artlinx-setting",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/Setting.vue"),
  },
  {
    path: "/change-pwd",
    name: "ChangePwd",
    meta: {
      title: "Artlinx-Change Password",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(/* webpackChunkName: "user" */ "../views/ChangePwd.vue");
      } else {
        return import(
          /* webpackChunkName: "user" */ "../pcviews/ChangePwd.vue"
        );
      }
    },
  },
  {
    path: "/funding",
    name: "Funding",
    meta: {
      title: "Artlinx-Balance",
    },
    component: () => {
      if (clientWidth < 800) {
        return import(
          /* webpackChunkName: "user" */ "../views/TradeManage.vue"
        );
      } else {
        return import(
          /* webpackChunkName: "user" */ "../pcviews/TradeManage.vue"
        );
      }
    },
  },
  {
    path: "/order-info/:id",
    name: "OrderInfo",
    meta: {
      title: "Artlinx-OrderInfo",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/PC/BuyDetail.vue"),
  },
  {
    path: "/recharge",
    name: "Recharge",
    meta: {
      title: "Artlinx-The balance of prepaid phone",
    },
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/PC/RechargeBalance.vue"),
  },
];

// const router = new VueRouter({
//   routes,
//   scrollBehavior (to, from, savedPosition) {
//     return { x: 0, y: 0 }
//   }
// });

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
    };
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
