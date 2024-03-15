<template>
  <div id="userLayout" :class="['user-layout-wrapper', 'desktop']">
    <div class="container">
      <div class="top">
        <div class="header">
          <logo-svg style="width: 32px; height: 32px" />
          <span class="title"> 爱星物联云管平台 </span>
          <version />
        </div>
      </div>
      <div
        style="
          position: absolute;
          left: 50%;
          top: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0px 0px 12px rgba(71, 91, 239, 0.2);
        "
      >
        <route-view></route-view>
      </div>
      <div class="footer">
        Copyright @2021 深圳市安信可科技有限公司 粤ICP备13001817号-2
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from "./RouteView";
import Version from "@/components/GlobalHeader/Version.vue";
import LogoSvg from "../assets/logo.svg?inline";

export default {
  name: "UserLayout",
  components: { RouteView, LogoSvg,Version },
  data() {
    return {};
  },
  mounted() {
    document.body.classList.add("userLayout");
  },
  beforeDestroy() {
    document.body.classList.remove("userLayout");
  },
};
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
        height: 100%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f4f8fe;
    background-size: 100%;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #242933;
      padding: 0 30px;
      .header {
        display: flex;
        align-items: center;
        height: 66px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          padding: 0 10px;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 10px 20px;
      text-align: center;
      color: #fff;
      background-color: #242933;
      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>
