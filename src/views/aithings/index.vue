<template>
  <div>
      <div class="wrap">
        <div class="module-title">产品管理——配置流程导航</div>
        <div class="flex x-space-between">
          <div v-for="v in topTabbar" :key="v.type" :class="['select-part flex1 arrow',{disabled: v.disabled}]" @click="linkToPage(v.path, v.name, v.disabled)">
            <img :src="v.img" />
            <div class="select-name">
              {{ v.title }}
            </div>
            <p class="details">
              {{ v.remind }}
            </p>
            
          </div>
        </div>
        
      </div>
      <div class="wrap" v-if="centerTabbar.length > 0">
        <div class="module-title">OEM App管理</div>
        <div class="flex x-space-between">
          <div v-for="v in centerTabbar" :key="v.type" class="select-part flex1" @click="linkToPage(v.path, v.name)">
            <img :src="v.img" />
            <div class="select-name">
              {{ v.title }}
            </div>
            <p class="details">
              {{ v.remind }}
            </p>
            
          </div>
        </div>
        
      </div>
      <div class="wrap" v-if="bottomTabbar.length > 0">
        <div class="module-title">数据中心</div>
        <div class="worker-part">
          <div
            class="worker-data flex"
            v-for="v in bottomTabbar"
            :key="v.type"
            @click="linkToPage(v.path, v.name)"
          >
            <img :src="v.img" />
            <div class="worker-name aithings-microcheiria">{{ v.title }}</div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Aithings",
  data() {
    return {
      topOrigin: [
        {
          type: 1,
          img: require("../../../src/assets/image/dashboard1.png"),
          title: "产品分类",
          remind: "一级和二级分类用于在开放平台展示，二级分类用于在App展示。",
          name: "Classification",
          path: "/product/classification/index",
        },
        {
          type: 2,
          img: require("../../../src/assets/image/dashboard2.png"),
          title: "固件管理",
          remind: "固件的创建修改以及版本维护，以及固件和固件版本的禁用",
          name: "Firmware",
          path: "/product/firmware",
        },
        {
          type: 3,
          img: require("../../../src/assets/image/dashboard3.png"),
          title: "模组管理",
          remind: "模组是智能设备与云端通讯的重要元器件。",
          name: "Chip",
          path: "/product/chip/index",
        },
        {
          type: 4,
          img: require("../../../src/assets/image/dashboard4.png"),
          title: "控制面板",
          remind: "根据不同的功能指令开发了不同的控制面板。可匹配到二级产品分类或者具体的产品类型。",
          name: "ControlPanel",
          path: "/product/control-panel",
        },
        {
          type: 5,
          img: require("../../../src/assets/image/dashboard5.png"),
          title: "产品类型",
          remind: "产品类型继承了产品分类，关联模组（也就关联了固件），关联控制面板，设置配网方式，设置场景条件。",
          name: "StandardProduct",
          path: "/product/index",
        },
      ],
      centerOrigin: [
        {
          type: 1,
          img: require("../../../src/assets/image/dashboard6.png"),
          title: "底部菜单栏",
          remind: "用于在开放平台，OEM App底部菜单栏的初始数据。",
          path: "/oem-app/footer-menu",
          name: "AppFooterMenu",
        },
        {
          type: 2,
          img: require("../../../src/assets/image/dashboard7.png"),
          title: "App语言包",
          remind: "用于在开放平台，OEM App的初始数据。",
          path: "/oem-app/app-lang",
          name: "AppLang",
        },
        {
          type: 3,
          img: require("../../../src/assets/image/dashboard8.png"),
          title: "帮助中心",
          remind: "用于在开放平台，OEM App帮助中心的初始数据。",
          path: "/oem-app/help-center",
          name: "HelpCenter",
        },
        {
          type: 4,
          img: require("../../../src/assets/image/dashboard9.png"),
          title: "辅助上架",
          remind: "给开放平台上的开发者OEM App排期上架各大应用市场。",
          path: "/oem-app/assist-putaway",
          name: "AssistPutaway"
        },
        {
          type: 5,
          img: require("../../../src/assets/image/dashboard10.png"),
          title: "App模板管理",
          remind: "针对App模板进行版本管理。",
          path: "/oem-app/template-manage",
          name: "TemplateManage",
        },
      ],
      bottomOrigin: [
        {
          type: 1,
          img: require("../../../src/assets/image/dashboard11.png"),
          title: "数据概览中心",
          path: "/data-center/data-overview",
          name: "DataOverview",
        },
        {
          type: 2,
          img: require("../../../src/assets/image/dashboard12.png"),
          title: "App数据",
          path: "/data-center/app-data",
          name: "AppData",
        },
        {
          type: 3,
          img: require("../../../src/assets/image/dashboard13.png"),
          title: "开发者数据",
          path: "/data-center/developer-data",
          name: "DeveloperData",
        },
        {
          type: 4,
          img: require("../../../src/assets/image/dashboard14.png"),
          title: "设备故障数据",
          path: "/data-center/device-fault-data",
          name: "DeviceFaultData",
        },
      ],
      topTabbar:[],
      centerTabbar:[],
      bottomTabbar:[]
    };
  },
  computed:{
    ...mapGetters(["roles"]),
  },

  watch: {
    roles(val) {
      this.changeData()
    },
  },
  created() {
    if(this.roles) {
      this.changeData()
    }
  },
  methods: {
    changeData(){

      // 产品管理
      const productList = this.roles.filter(item=>item.name == 'Product')?.pop()?.children || []
      this.topTabbar = this.topOrigin.map(item=>{
        return {
          ...item,
          disabled: !productList.some(m=>m.name === item.name)
        }
      })

      // OEM App管理
      const appList = this.roles.filter(item=>item.name == 'OemApp')?.pop()?.children || []
      this.centerTabbar = this.centerOrigin.filter(item=>appList.some(m=>m.name === item.name))

      // 数据中心
      const dataList = this.roles.filter(item=>item.name == 'DataCenter')?.pop()?.children || []
      this.bottomTabbar = this.bottomOrigin.filter(item=>dataList.some(m=>m.name === item.name))
    },

    linkToPage(path, name, disabled) {
      if(disabled){
        this.$message.warning('对不起，你没有访问的权限~', 2);
      } else{
        this.$routerPush({
          path,
          name,
        });
      }
      
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-page-header{
  padding: 0;
}
/deep/.ant-page-header-content {
  padding-top: 15px;
}
.flex{
  display: flex;
}
.flex1{
  flex: 1;
}
.x-space-between{
  justify-content: space-between;
}
.wrap{
  padding: 18px 15px;
  box-shadow: 0px 0px 6px 0px rgba(166,196,255,0.22);
  background: #ffffff;
}
.wrap+.wrap{
  margin-top: 20px;
}
/deep/.ant-card {
  border-radius: 4px;
  border: 1px solid #dae6f8;
}
/deep/.ant-card-body {
  padding: 20px;
}
.ant-btn-primary {
  background: #fff;
  color: #3b7cff;
  border: 1px solid #3b7cff;
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background: #3b7cff;
  color: #fff;
}
.select-part+.select-part{
  margin-left: 30px;
}
.select-part {
  cursor: pointer;
  text-align: center;
  img {
    width: 64px;
    height: 64px;
  }
  .select-name {
    padding: 15px 0 ;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    color: #343a40;
  }
}
.select-part:not(.disabled):hover{
  .select-name {
    color: #3B7CFF;
  }
}
.disabled{
  cursor:no-drop;
  .select-name{
    color: #70757D;
    
  }
} 
.module-title {
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  text-indent: 5px;
  color: #343a40;
  border-left: 4px solid #3B7CFF;
}
.worker-part {
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  padding: 10px 0 30px;
  .worker-data {
    align-items: center;
    cursor: pointer;
    flex: 1;
  }
  img {
    width: 48px;
    height: 48px;
  }
  .worker-name {
    text-indent: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #343a40;
  }
  .worker-data:hover .worker-name{
    color: #3B7CFF;
  }
}
.arrow+.arrow{
  position: relative;
  &::before{
    position: absolute;
    left: calc(-50% - 30px + 45px);
    top: 32px;
    content: '';
    width: calc(100% - 90px + 30px);
    height: 1px;
    display: block;
    background-image: linear-gradient(to right, #8392A7 0%, #8392A7 50%, transparent 50%);
    background-size: 14px 1px;
    background-repeat: repeat-x;
  }
  &::after{
    position: absolute;
    left: calc(50% - 45px);
    top: 29px;
    content: '';
    width: 7px;
    height: 7px;
    display: block;
    background: #fff;
    border: 1px solid #8392A7;
    border-radius: 50%;
  }
}
.details{
  margin: 0;
  padding: 0 20px 20px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  color: #70757D;
  line-height: 18px;
}
</style>
