<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input allowClear v-model="queryParam.deptName" :placeholder="$t('authorityAdm.dept.inputDeptName')" @keyup.enter.native="queryList"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="queryList">
                {{ $t("public.query") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleAdd('')">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 提示语 -->
    <div class="table-operator">
      <a-alert
        message="提示：部门下有下级部门或者账号禁止删除,顶级部门禁止编辑"
        type="warning"
        banner
        closable
      />
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="deptId"
      :pagination="false"
      :expandedRowKeys="expandedKeys"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      @expandedRowsChange="
        (e) => {
          expandedKeys = e;
        }
      "
    >
      <template slot="createdAt" slot-scope="text, record">
        <span>{{ record.createdAt | momentFilter }}</span>
      </template>
      <template v-slot:action="item">
        <a-button
          type="link"
          size="small"
          icon="edit"
          :disabled="item.parentId == '0'"
          @click="handleEdit(item.deptId)"
        >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="plus"
          @click="handleAdd(item.deptId)"
        >
          {{ $t("public.add") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button
          type="link"
          size="small"
          icon="delete"
          :disabled="item.children && item.children.length !== 0"
          @click="handleDel(item.deptId)"
        >
          {{ $t("public.delete") }}
        </a-button>
      </template>
    </a-table>
    <!-- 添加编辑框 -->
    <a-modal
      :title="modalTitle"
      :width="800"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <!-- 上级菜单 如果没有树级菜单 或者顶级父部门 不需要上级菜单  负责人-->
          <a-row v-if="treeData.length && form.parentId !== 0">
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.PreviousMenu')"
                prop="parentId"
              >
                <a-tree-select
                  v-model="form.parentId"
                  :replaceFields="replaceFields"
                  :tree-data="treeData"
                  :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                  style="width: 100%"
                  :placeholder="$t('authorityAdm.dept.selectPreviousMenu')"
                  allow-clear
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.principal')"
                prop="leader"
              >
                <a-input placeholder="请输入负责人" v-model="form.leader" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 部门名称 显示排序 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.deptName')"
                prop="deptName"
              >
                <a-input placeholder="请输入部门名称" v-model="form.deptName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.showSort')"
                prop="orderNum"
              >
                <a-input-number
                  style="width: 100%"
                  placeholder="请输入排序, 1~999"
                  v-model="form.orderNum"
                  :min="1"
                  :max="999"
                  :precision="0"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!--  邮箱 联系电话 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.email')"
                prop="email"
              >
                <a-input placeholder="请输入邮箱" v-model="form.email" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                :label-col="two.labelCol"
                :wrapper-col="two.wrapperCol"
                :label="$t('authorityAdm.dept.phone')"
                prop="phone"
              >
                <a-input placeholder="请输入联系电话" v-model="form.phone" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-divider type="vertical" />
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="confirmLoading"
        >
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import { getDepartmentList, addDepartment, getDepartmentInfo, editDepartment, deleteDepartment} from "@/api/authority";
import { arrToTree } from "@/utils/util";
import { PhoneRules, EmailRules, CommonRules, CommonNameRules} from "@/utils/validate";
export default {
  name: "Department",
  data() {
    return {
      isInit:false,
      queryParam: {},
      // 表格
      columns: [
        {
          dataIndex: "deptName",
          title: this.$t("authorityAdm.dept.deptName"),
          ellipsis: true,
        },
        {
          dataIndex: "orderNum",
          title: this.$t("authorityAdm.dept.showSort"),
        },
        {
          dataIndex: "createdAt",
          title: this.$t("public.createdTime"),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "290px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      expandedKeys: [], // 展开ID
      loading: false,
      // 添加编辑框
      form: {},
      modalTitle: "",
      visible: false,
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 }},
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 }},
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 }},
      },
      // 上级菜单
      replaceFields: {
        children: "children",
        title: "deptName",
        key: "deptId",
        value: "deptId",
      },
      treeData: [],
      rules: {
        deptName: CommonNameRules(this.$t("authorityAdm.dept.inputDeptName")),
        parentId: CommonRules(this.$t("authorityAdm.dept.selectPreviousMenu")),
        orderNum: CommonRules("请输入正确的部门排序", "number"),
        leader: CommonNameRules(this.$t("authorityAdm.dept.inputDeptPrincipal")),
        phone: PhoneRules(this.$t("authorityAdm.dept.inputPhone")),
        email: EmailRules(this.$t("authorityAdm.dept.inputEmail")),
      },
    };
  },
  created() {
    this.isInit = true
    this.queryList();
  },
  activated () {
    if(this.isInit){
      this.isInit = false
    }else{
    this.queryList()
    }
  },
  methods: {
    queryList() {
      this.loading = true;
      this.expandedKeys = [];
      getDepartmentList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = arrToTree(res.data.list, "deptId", "parentId");
            this.treeData = this.dataSource;
            this.expandKeys(this.dataSource, this.expandedKeys);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取树型接口的key，包括Children
    expandKeys(data, keys = []) {
      data.map((item) => {
        keys.push(item.deptId);
      });
    },
    handleEdit(id) {
      this.confirmLoading = true;
      this.visible = true;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.modalTitle = this.$t("authorityAdm.dept.editDept");
      getDepartmentInfo({ id })
        .then((res) => {
          if (res.code === 0) {
            this.form = res.data;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleDel(id) {
      this.$Delete(this, "").then((res) => {
        deleteDepartment({ ids: [id] }).then((res) => {
          this.toast(res);
          this.queryList();
        });
      });
    },
    handleAdd(parentId) {
      this.visible = true;
      this.modalTitle = this.$t("authorityAdm.dept.addDept");
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      this.form = {
        status: 1,
      };
      if (parentId) this.form.parentId = parentId; // 某一部门新增
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (!this.form.deptId) {
          res = await addDepartment(this.form);
        } else {
          res = await editDepartment(this.form);
        }
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.queryList();
          this.visible = false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
