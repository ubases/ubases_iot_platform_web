<script>
import events from "./events";

export default {
  name: "MultiTab",
  data() {
    return {
      fullPathList: [],
      pages: [],
      activeKey: "", // 当前选中的
      lastKey: "", // 上一次选中的
      newTabIndex: 0,
    };
  },
  created() {
    // bind event
    events
      .$on("open", (val) => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`);
        }
        this.activeKey = val;
        
      })
      .$on("closeCurrentPage", () => {
        this.closeCurrentPage(this.activeKey);
      })
      .$on("close", (val) => {
        if (!val) {
          this.closeThat(this.activeKey);
          return;
        }
        this.closeThat(val);
      })
      .$on("rename", ({ key, name }) => {
        try {
          const item = this.pages.find((item) => item.path === key);
          item.meta.customTitle = name;
          this.$forceUpdate();
        } catch (e) {}
      });

    this.pages.push(this.$route);
    this.fullPathList.push(this.$route.fullPath);
    this.selectedLastPath();
  },
  methods: {
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    tabClick(path){
      // console.log('tabClick',path, this.activeKey)
      // if(path == this.activeKey) return
      // const item = this.pages.filter((page) => page.fullPath == path)?.pop()
      
      // if(item && item.meta.keepalive){
      //   console.log('item.meta.keepalive',item.meta.keepalive)
      //   this.$store.commit("addRouterKeepAlive", item.name);
      // }
      
      // console.log(this.$store.getters.includeRouterView)
      
    },
    closeCurrentPage(targetKey) {
      console.log('closeCurrentPage')
      // 详情页面是否清除
      const name = this.pages.filter((page) => page.fullPath == targetKey)?.pop()?.name
      this.pages = this.pages.filter((page) => page.fullPath !== targetKey);
      this.fullPathList = this.fullPathList.filter(
        (path) => path !== targetKey
      );
      // 浏览器前进后退会扰乱 router.go 执行
      this.lastKey ? (this.activeKey = this.lastKey) : this.$router.go(-1);
      if(this.$store.getters.includeRouterView.includes(name)){
        this.$store.commit("delRouterKeepAlive", name);
      }
    },
    remove(targetKey) {
      const name = this.pages.filter((page) => page.fullPath == targetKey)?.pop()?.name
      this.pages = this.pages.filter((page) => page.fullPath !== targetKey);
      this.fullPathList = this.fullPathList.filter(
        (path) => path !== targetKey
      );
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath();
      }
      if(this.$store.getters.includeRouterView.includes(name)){
        this.$store.commit("delRouterKeepAlive", name);
      }
    },
    selectedLastPath() {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1];
    },

    // content menu
    closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e);
      } else {
        this.$message.info("这是最后一个标签了, 无法被关闭");
      }
    },
    closeLeft(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info("左侧没有标签");
      }
    },
    closeRight(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex < this.fullPathList.length - 1) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info("右侧没有标签");
      }
    },
    closeAll(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item);
        }
      });
    },
    closeMenuClick(key, route) {
      this[key](route);
    },
    renderTabPaneMenu(e) {
      return (
        <a-menu
          {...{
            on: {
              click: ({ key, item, domEvent }) => {
                this.closeMenuClick(key, e);
              },
            },
          }}
        >
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      );
    },
    // render
    renderTabPane(title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath);

      return (
        <a-dropdown overlay={menu} trigger={["contextmenu"]}>
          <span style={{ userSelect: "none" }}>{title}</span>
        </a-dropdown>
      );
    },
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.activeKey = newVal.fullPath;
      // 如果list已有相同的存在就不添加选择替换 同时保存上一次跳转的
      this.lastKey = oldVal.fullPath;
      let i = null;
      let bl = this.pages.some((value, index) => {
        i = index;
        return value.path === newVal.path;
      });
      if (bl) {
        this.fullPathList.splice(i, 1, newVal.fullPath);
        this.pages.splice(i, 1, newVal);
      } else if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath);
        this.pages.push(newVal);
      }
    },
    activeKey: function (newPathKey) {
      const menu = this.pages.filter(item=> item.fullPath == newPathKey)?.pop()
      if(menu && menu.meta.keepalive){
        this.$store.commit("addRouterKeepAlive", menu.name);
      }
      console.log(this.$store.getters.includeRouterView)
      this.$router.push({ path: newPathKey });
    },
  },
  render() {
    const {
      onEdit,
      tabClick,
      $data: { pages },
    } = this;
    const panes = pages.map((page,index) => {
      
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(
            page.meta.customTitle || page.meta.title,
            page.fullPath
          )}
          key={page.fullPath}
          closable={pages.length > 1}
        ></a-tab-pane>
      );
    });

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={"editable-card"}
            v-model={this.activeKey}
            tabBarStyle={{
              background: "#FFF",
              margin: 0,
              paddingLeft: "16px",
              paddingTop: "1px",
            }}
            {...{ on: { edit: onEdit, tabClick: tabClick } }}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    );
  },
};
</script>
