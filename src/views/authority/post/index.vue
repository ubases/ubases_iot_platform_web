<template>
  <a-card :bordered="false">
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.postCode" :placeholder="$t('authorityAdm.post.inputPostCode')" :allowClear="true"  @keyup.enter.native="query"/>
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input v-model="queryParam.postName" :placeholder="$t('authorityAdm.post.inputPostName')" :allowClear="true"  @keyup.enter.native="query" />
            </a-form-item>
          </a-col>
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-select v-model="queryParam.status" placeholder="请选择状态" :allowClear="true" @keyup.enter.native="query">
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
              <a-button type="primary" icon="plus" @click="handleAdd()">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <!-- 提示语 -->
      <a-alert message="提示：岗位下有账号禁止删除" type="warning" banner closable />
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="postId"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <!-- :row-selection="rowSelection" -->
      <template slot="status" slot-scope="text, record">
        <span>{{ $DictName("web_status", record.status) }}</span>
      </template>
      <template slot="createdAt" slot-scope="text, record">
        <span>{{ record.createdAt | momentFilter }}</span>
      </template>
      <template v-slot:action="item">
        <a-button type="link" size="small" icon="edit" @click="handleEdit(item.postId)" >
          {{ $t("public.edit") }}
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" @click="handleDel([item.postId])" >
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
          <!-- 岗位名称 岗位编码 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" :label="$t('authorityAdm.post.postName')" prop="postName" >
                <a-input v-model="form.postName" placeholder="请输入岗位名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" :label="$t('authorityAdm.post.postStatus')" prop="status" >
                <a-radio-group v-model="form.status">
                  <a-radio v-for="v in $DictList('web_status')" :key="v.key" :value="v.key">
                    {{ v.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 岗位状态 显示排序 -->
          <a-row>
            <a-col :span="12">
              <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" :label="$t('authorityAdm.post.postCode')" prop="postCode" >
                <a-input v-model="form.postCode" placeholder="请输入岗位编码" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" :label="$t('authorityAdm.post.postSort')" prop="postSort" >
                <a-input-number style="width: 100%" v-model="form.postSort" :min="1" :max="999" :precision="0" placeholder="请输入排序, 1~999" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 备注 -->
          <a-row>
            <a-col :span="24">
              <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="$t('public.remark')" >
                <input-textarea v-model="form.remark" placeholder="请输入备注"
                ></input-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-divider type="vertical" />
        <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading" >
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import { getPostList, addPost, getPostInfo, editPost, deletePost} from "@/api/authority";
import { CommonRules, CommonNameRules } from "@/utils/validate";
export default {
  name: "Post",
  data() {
    return {
      isInit:false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表格
      columns: [
        {
          title: "序号",
          width: "50px",
          customRender: (item, value, index) => index + 1,
        },
        {
          dataIndex: "postCode",
          title: this.$t("authorityAdm.post.postCode"),
          ellipsis: true,
        },
        {
          dataIndex: "postName",
          title: this.$t("authorityAdm.post.postName"),
          ellipsis: true,
        },
        {
          dataIndex: "postSort",
          title: this.$t("authorityAdm.post.postSort"),
        },
        {
          dataIndex: "status",
          title: this.$t("authorityAdm.post.postStatus"),
          scopedSlots: { customRender: "status" },
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
            return v.postId;
          });
        },
      },
      selectedRowKeys: [],
      // 添加编辑框
      modalTitle: "",
      form: {},
      visible: false,
      confirmLoading: false,
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 } },
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
      },
      rules: {
        postName: CommonNameRules(this.$t("authorityAdm.post.inputPostName")),
        status: CommonRules( this.$t("authorityAdm.post.selectPostStatus"), "number" ),
        postCode: CommonNameRules(this.$t("authorityAdm.post.inputPostCode")),
        postSort: CommonRules("请输入正确的排序", "number"),
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
      getPostList(this.queryParam)
        .then((res) => {
          if (res.code == 0) {
            this.dataSource = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(id) {
      this.confirmLoading = true;
      this.visible = true;
      this.modalTitle = this.$t("authorityAdm.post.editPost");
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      getPostInfo({ id })
        .then((res) => {
          if (res.code === 0) {
            this.form = res.data;
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
        deletePost({ ids }).then((res) => {
          this.toast(res);
          this.queryList();
          this.selectedRowKeys = []; // 处理多项删除按钮不能恢复禁选
        });
      });
    },
    handleAdd() {
      this.visible = true;
      this.modalTitle = this.$t("authorityAdm.post.addPost");
      this.form = {
        status: 1,
      };
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
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
        if (!this.form.postId) {
          res = await addPost(this.form);
        } else {
          res = await editPost(this.form);
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
