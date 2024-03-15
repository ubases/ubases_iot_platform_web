<template>
  <a-card :bordered="false">
    <a-row :gutter="16">
      <a-col :xxl="6" :xl="8" :lg="24" :md="24" :sm="24">
        <a-spin :spinning="loading">
          <a-card title="目录" size="small" :bordered="false">
            <div v-for="value in menuList" :key="value.id">
              <a-row type="flex" justify="space-between" align="middle" style="padding: 10px 0" >
                <a-col :span="16">
                  <a-space align="center" @click="handleClick(value.id, value.collapse)">
                    <icon-font type="caret-down" v-if="value.children && value.children.length && value.collapse"></icon-font>
                    <icon-font type="caret-right" v-else-if="value.children && value.children.length && !value.collapse"></icon-font>
                    <img :src="value.dirImg" class="dir-img"/>
                    <div :class="[ 'aithings-microcheiria', value.id === activeIds[0] && 'active',]">
                      {{ value.docDirName }}
                    </div>
                  </a-space>
                </a-col>
                <a-col>
                  <a-button size="small" icon="edit" @click="editCatalogue(value.id)"/>
                  <a-button size="small" type="primary" icon="plus" style="margin-left: 6px" @click="addCatalogue(value.id)"/>
                  <a-button size="small" type="danger" icon="delete" style="margin-left: 6px" :disabled="Boolean(value.children)" @click="deleteCatalogue(value.id)"/>
                </a-col>
              </a-row>
              <collapse-transition>
                <div v-if="value.collapse && value.children">
                  <div v-for="item in value.children" :key="item.id">
                    <a-row type="flex" justify="space-between" align="middle" style="padding: 0 0 10px 20px">
                      <a-col :span="16">
                        <a-space align="center" @click="queryTable(value.id, item.id)">
                          <img :src="item.dirImg" class="dir-img"/>
                          <div :class="['aithings-microcheiria', item.id === activeIds[1] && 'active',]">
                            {{ item.docDirName }}
                          </div>
                        </a-space>
                      </a-col>
                      <a-col>
                        <a-button size="small" icon="edit" @click="editCatalogue(item.id)"/>
                        <a-button size="small" type="danger" icon="delete" style="margin-left: 6px" @click="deleteCatalogue(item.id)"/>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </collapse-transition>
            </div>
            <a-button style="width: 100%; margin-top: 10px" icon="plus" @click="addCatalogue('0')">
              添加一级目录
            </a-button>
          </a-card>
        </a-spin>
      </a-col>
      <a-col :xxl="18" :xl="16" :lg="24" :md="24" :sm="24">
        <problem-table ref="problemTable" :menuList="menuList"></problem-table>
      </a-col>
    </a-row>
    <catalogue-modal ref="catalogueModal" @ok="queryList"></catalogue-modal>
  </a-card>
</template>
<script>
import { deleteDocDirectory, getDocDirectoryList } from "@/api/oemApp";
import ProblemTable from "../components/ProblemTable.vue";
import CatalogueModal from "../components/CatalogueModal.vue";
import { arrToTree } from "@/utils/util";
import CollapseTransition from "../components/collapse";
export default {
  components: {
    "problem-table": ProblemTable,
    "catalogue-modal": CatalogueModal,
    "collapse-transition": CollapseTransition,
  },
  provide() {
    return {
      menuList: () => this.menuList, // 穿透组件传递动态数据需要返回函数
    };
  },
  data() {
    return {
      menuList: [],
      loading: false,
      activeIds: [],
      id:''
    };
  },
  created() {
    this.id = this.$route.query.id
    this.queryList();
  },
  methods: {
    queryList() {
      this.loading = true;
      getDocDirectoryList({helpId:this.id})
        .then((res) => {
          if (res.code === 0) {
            const data = res.data?.sort((a,b)=> {return a.sort-b.sort})
            this.menuList = arrToTree(data, "id", "parentId").map((v) => {
              return {
                ...v,
                collapse: false,
              };
            });
            if (!this.menuList.length) return;
            this.handleClick(this.menuList[0].id);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    queryTable(valueId, itemId) {
      this.activeIds[0] = valueId;
      this.activeIds[1] = itemId;
      this.$refs["problemTable"].init(this.activeIds);
      this.$forceUpdate();
    },
    handleClick(id, collapse) {
      this.activeIds[0] = id;
      this.activeIds[1] = "";
      this.$refs["problemTable"].init(this.activeIds);
      this.$forceUpdate();
      if (collapse) return;
      this.menuList.forEach((v) => {
        if (v.id === id) {
          v.collapse = !v.collapse;
        } else {
          v.collapse = false;
        }
      });
    },
    addCatalogue(parentId) {
      this.$refs["catalogueModal"].init({ type: "add", parentId, helpId: this.id});
    },
    editCatalogue(id) {
      this.$refs["catalogueModal"].init({ type: "edit", id });
    },
    deleteCatalogue(id) {
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: () => {
          deleteDocDirectory({ id }).then((res) => {
            this.toast(res);
            if (res.code === 0) {
              this.queryList();
              this.activeIds.forEach((value) => {
                id === value && this.$refs["problemTable"].init([]); // 需要重置右边词条表格
              });
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.active {
  color: @app-theme-color;
}
.aithings-microcheiria {
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dir-img{
  max-width: 24px;
  max-height: 24px;
}
</style>
