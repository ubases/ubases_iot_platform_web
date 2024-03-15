<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.roleName" :placeholder="$t('authorityAdm.role.inputRoleName')" :allowClear="true"  @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.status" :placeholder="$t('authorityAdm.role.selectRoleStatus')" :allowClear="true" @keyup.enter.native="query" >
                <a-select-option v-for="v in $DictList('web_status')" :key="v.key" :value="v.key" >
                  {{ v.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="query">
                {{ $t("public.query") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset">
                {{ $t("public.reset") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleAdd">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 提示语 -->
    <div class="table-operator">
      <a-alert message="提示：角色下有账号禁止删除" type="warning" banner closable/>
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="roleId"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <!-- :row-selection="rowSelection" -->
      <template v-slot:status="item">
        <a-switch :checked="item.statusBl" @change="switchStatus(item)" />
      </template>
      <template v-slot:action="item">
        <a-button type="link" size="small" icon="edit" @click="handleEdit(item.roleId)" >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" @click="handleDel([item.roleId])" >
          {{ $t("public.delete") }}
        </a-button>
      </template>
    </a-table>
    <!-- 添加编辑框 -->
    <a-modal
      :title="modalTitle"
      :width="640"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model
          ref="ruleForm"
          layout="horizontal"
          :model="form"
          :rules="rules"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 20 }"
        >
          <a-form-model-item :label="$t('authorityAdm.role.roleName')" prop="roleName" >
            <a-input v-model="form.roleName" placeholder="请输入角色名称" />
          </a-form-model-item>
          <a-form-model-item :label="$t('authorityAdm.role.roleStatus')" prop="status" >
            <a-radio-group v-model="form.status">
              <a-radio v-for="v in $DictList('web_status')" :key="v.key" :value="v.key" >
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item :label="$t('authorityAdm.role.roleSort')" prop="roleSort" >
            <a-input-number style="width: 100%" v-model="form.roleSort" :min="1" :max="999" :precision="0" placeholder="请输入排序, 1~999" />
          </a-form-model-item>
          <a-form-model-item v-if="visible && treeData.length" :label="$t('authorityAdm.role.MenuAuth')" >
            <a-tree
              checkable
              checkStrictly
              v-model="checkedKeys"
              :replaceFields="replaceFields"
              :tree-data="treeData"
              @check="handleCheck"
            >
            </a-tree>
          </a-form-model-item>
          <a-form-model-item :label="$t('authorityAdm.role.roleRemark')">
            <input-textarea v-model="form.remark" :maxLength="500" placeholder="请输入备注"></input-textarea>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-divider type="vertical" />
        <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import { getRoleList, deleteRole, editRole, getRoleInfo, addRole, setRoleStatus, getRoleAddAuth} from "@/api/authority";
import { CommonRules, CommonNameRules } from "@/utils/validate";
export default {
  data() {
    return {
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表格
      columns: [
        {
          title: "序号",
          width: "80px",
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "roleName",
          title: this.$t("authorityAdm.role.roleName"),
          ellipsis: true,
        },
        {
          dataIndex: "roleSort",
          title: "排序",
        },
        {
          dataIndex: "remark",
          title: "备注",
          width: "300px",
          ellipsis: true,
        },
        {
          title: this.$t("authorityAdm.role.roleStatus"),
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRows.map((v) => {
            return v.roleId;
          });
        },
      },

      selectedRowKeys: [],
      // 添加编辑框
      modalTitle: "",
      form: {},
      visible: false,
      confirmLoading: false,
      rules: {
        roleName: CommonNameRules(this.$t("authorityAdm.role.inputRoleName")),
        roleSort: CommonRules("请输入正确的排序", "number"),
        status: CommonRules(
          this.$t("authorityAdm.role.selectRoleStatus"),
          "number"
        ),
      },
      treeData: [], // 权限菜单
      replaceFields: {
        children: "children",
        title: "title",
        key: "id",
        value: "id",
      },
      checkedKeys:[]
    };
  },
  created() {
    this.queryList();
  },
  methods: {

    handleCheck(checkedKeys, e){
      // console.log(val)
      if(e.checked){
          let parentMenus = this.filterReleMenus(e.node, 1)// 添加父级菜单
          parentMenus = [...checkedKeys.checked, ...parentMenus]
          let childrens = e.node.getNodeChildren()
          let subMenus = []
          if(childrens.length){
            childrens.forEach((children)=>{
              subMenus = [...subMenus, ...this.filterReleMenus(children.data.props.dataRef, 2)]// 添加子级菜单
            })
          }
          console.info(subMenus);
          let allMenus = [...parentMenus, ...subMenus]
          checkedKeys.checked = [...new Set(allMenus)]
        }else{
          let menus = this.deleteReleMenus(checkedKeys.checked, e.node, 1)// 删除父级菜单后的菜单
          menus = this.deleteReleMenus(menus, e.node.dataRef, 2)// 删除子级菜单后的菜单
          checkedKeys.checked = [...new Set(menus)]
        }

    },
    // 子集菜单
    filterReleMenus(node, type){
      let releMenus = []
      if(type == 1 && node.$parent.eventKey){// 添加父节点
        releMenus = [node.eventKey, node.$parent.eventKey]
        releMenus = [...releMenus, ...this.filterReleMenus(node.$parent, 1)]
      }else if(type == 2 && node){// 添加子节点
        releMenus.push(node.id)

        node.children.forEach((children)=>{
          releMenus = [...releMenus, ...this.filterReleMenus(children, 2)]
        })
        
      }
      return releMenus
    },

    // 取消节点逻辑
    deleteReleMenus(checkedKeys, node, type){
      let releMenus = [...checkedKeys]
      if(type == 1 && node.$parent.eventKey){// 取消选择父节点
        let children = node.$parent.getNodeChildren()
        let include = false
        children.forEach(menu=>{
          if(checkedKeys.indexOf(menu.key) != -1){
            include = true
          }
        })
        if(!include){
          let index = releMenus.indexOf(node.$parent.eventKey)
          if(index != -1){
            releMenus.splice(index, 1)
          }
          releMenus = this.deleteReleMenus(releMenus, node.$parent, 1)
        }
      }else if(type == 2 && node){// 取消选择子节点
        node.children.forEach(menu=>{
          let index = releMenus.indexOf(menu.id)
          if(index != -1){
            releMenus.splice(index, 1)
          }
          releMenus = this.deleteReleMenus(releMenus, menu, 2)
        })
      }
      return releMenus
    },

    query() {
      this.queryParam.pageNum = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    reset() {
      this.queryParam = {
        pageNum: 1,
        pageSize: this.queryParam.pageSize,
      };
      this.pagination.current = 1;
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getRoleList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            res.data.list.forEach((v) => {
              if (v.status == 1) {
                v.statusBl = true;
              } else {
                v.statusBl = false;
              }
            });
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
            // 默认显示第一个的角色权限信息(右)
            this.$emit("clickRow", this.dataSource[0]);
          } else {
            this.dataSource = [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 角色状态切换
    switchStatus(item) {
      item.statusBl = !item.statusBl;
      item.statusBl ? (item.status = 1) : (item.status = 2);
      setRoleStatus({ roleId: item.roleId, status: item.status }).then(
        (res) => {
          this.toast(res);
        }
      );
    },
    handleEdit(roleId) {
      this.confirmLoading = true;
      this.visible = true;
      this.modalTitle = this.$t("authorityAdm.role.editRole");
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      getRoleInfo({ id: roleId })
        .then((res) => {
          if (res.code === 0) {
            this.treeData = res.data.menuList;
            this.form = {
              ...res.data.role,
              menuIds: res.data.checkedRules,
            };
            this.checkedKeys = res.data.checkedRules
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    // 多项删除
    handleDelIds() {
      this.handleDel(this.selectedRowKeys);
    },
    handleDel(ids) {
      this.$Delete(this, "").then((res) => {
        deleteRole({ ids }).then((res) => {
          this.toast(res);
          this.queryList();
          this.selectedRowKeys = []; // 处理多项删除按钮不能恢复禁选
        });
      });
    },
    handleAdd() {
      this.confirmLoading = true;
      this.visible = true;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.form = {
        roleName: "",
        roleSort: "",
        status: 1,
        remark: "",
        menuIds: [],
      };
      this.checkedKeys = []
      this.modalTitle = this.$t("authorityAdm.role.addRole");
      getRoleAddAuth()
        .then((res) => {
          if (res.code == 0) {
            this.treeData = res.data;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    onChangePagination(e) {
      this.queryParam.pageSize = e.pageSize;
      this.queryParam.pageNum = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        const menuId = this.checkedKeys.checked ? this.checkedKeys.checked : this.checkedKeys
        if (!this.form.roleId) {
          res = await addRole({...this.form,menuIds:menuId});
        } else {
          res = await editRole({...this.form,menuIds:menuId});
        }
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.visible = false;
          this.queryList();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
