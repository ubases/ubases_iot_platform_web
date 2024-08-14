<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="aColFlex">
            <a-form-item>
              <a-input
                v-model="queryParam.query.describe"
                placeholder="请输入服务器中文名称"
                :allowClear="true" 
                @keyup.enter.native="handleSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="handleSearch">
                {{ $t("public.search") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="redo" @click="reset"> 重置 </a-button>
              <a-divider type="vertical" />
              <a-button type="primary" icon="plus" @click="handleNew">
                {{ $t("public.add") }}
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      size="small"
      rowKey="id"
      :data-source="loadData"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @change="onChangePagination"
    >
    <span :style="{color:record.enabled==1 ? '#52c265':'#FF3333'}" slot="enabled" slot-scope="text, record">
      {{ $DictName('is_enabled',record.enabled ) }}
    </span>
    
      <template slot="action" slot-scope="text, record">
        <a-button v-if="record.enabled == 2" type="link" size="small" icon="edit" @click="handleEnable(record)">
          启用
        </a-button>
        <a-button v-if="record.enabled == 1" type="link" size="small" icon="edit" @click="handleEnable(record)">
          禁用
        </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="edit" @click="handleEdit(record)">
          {{ $t("public.edit") }}
        </a-button>
      </template>
    </a-table>

    <!-- 表单添加编辑框 -->
    <a-modal
      :width="640"
      :title="title"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" ref="form">
          <a-form-item label="服务ID" type="sid" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="50" v-model="form.sid" v-decorator="['sid',{rules:[{ required: true, message: '请输入服务ID' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="名称（中文）" type="describe" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="50" v-model="form.describe" v-decorator="['describe',{rules:[{ required: true, message: '请输入名称（中文）' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="名称（英文）" type="enDescribe" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="50" v-model="form.enDescribe" v-decorator="['enDescribe',{rules:[{ required: true, message: '请输入名称（英文）' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="HTTP地址" type="httpServer" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="100" v-model="form.httpServer" v-decorator="['httpServer',{rules:[{ required: true, message: '请输入HTTP地址' }]}]" placeholder="请输入">
              <a-select slot="addonBefore" v-model="httpServerProtocol" default-value="http://" style="width: 90px">
                <a-select-option value="http://">
                  http://
                </a-select-option>
                <a-select-option value="https://">
                  https://
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
          <a-form-item label="App MQTT地址" type="websocketServer" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="100" v-model="form.websocketServer" v-decorator="['websocketServer',{rules:[{ required: true, message: '请输入App MQTT地址' }]}]" placeholder="请输入">
              <a-select slot="addonBefore" v-model="websocketServerProtocol" default-value="wss://" style="width: 90px">
                <a-select-option value="ws://">
                  ws://
                </a-select-option>
                <a-select-option value="wss://">
                  wss://
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-item>
          <a-form-item label="设备MQTT地址" type="mqttServer" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input :maxLength="100" v-model="form.mqttServer" v-decorator="['mqttServer',{rules:[{ required: true, message: '请输入设备MQTT地址' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="设备MQTT端口" type="mqttPort" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="10" :max="99999" v-model="form.mqttPort" v-decorator="['mqttPort',{rules:[{ required: true, message: '请输入MQTT端口' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="国家电话区号" type="areaPhoneNumber" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number :min="10" :max="999999" v-model="form.areaPhoneNumber" v-decorator="['areaPhoneNumber',{rules:[{ required: true, message: '请输入国家电话区号' }]}]" placeholder="请输入"/>
          </a-form-item>
          <a-form-item label="是否启用" type="enabled" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-model="form.enabled" v-decorator="['enabled',{rules:[{ required: true, message: '请选择是否启用' }]}]">
              <a-radio :value="1"> 启用 </a-radio>
              <a-radio :value="2"> 禁用 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-spin>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-divider type="vertical" />
        <a-button key="submit" type="primary" @click="handleSubmit" :loading="confirmLoading">
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>
<script>
import {
  appServiceList,
  addAppService,
  editAppService,
  setAppServiceStatus
} from "@/api/configuration"
import pick from "lodash.pick";

export default {
  name: "AppApiService",
  data() {
    return {
      isInit:false,
      // 表格
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      loading: false,
      queryParam: {
        page: 1,
        limit: 10,
        query:{}
      },
      columns: [
        { title: "序号", width: "50px", customRender: (item, value, index) => index + 1 },
        { title: "服务ID", dataIndex: "sid"},
        { title: "中文名称", dataIndex: "describe", ellipsis: true},
        { title: "英文名称", dataIndex: "enDescribe", ellipsis: true },
        { title: "HTTP地址", dataIndex: "httpServer" },
        { title: "App MQTT地址", dataIndex: "websocketServer" },
        { title: "设备MQTT地址", dataIndex: "mqttServer" },
        { title: "设备MQTT端口", dataIndex: "mqttPort" },
        { title: "国家电话区号", dataIndex: "areaPhoneNumber" },
        { title: "当前状态", dataIndex: "enabled",scopedSlots: { customRender: "enabled" } },
        { title: this.$t("public.action"), dataIndex: "action", align: "center", width: "240px", scopedSlots: { customRender: "action" } },
      ],
      loadData: [],
      // 表单添加编辑
      form: this.$form.createForm(this),
      editId: "",
      title: "",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      confirmLoading: false,
      visible: false,
      httpServerProtocol: "http://",
      websocketServerProtocol:"wss://"
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
    reset() {
      this.queryParam.query = {}
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },
    handleSearch() {
      this.queryParam.page = 1;
      this.pagination.current = 1;
      this.queryList();
    },

    // 列表
    async queryList() {
      this.loading = true;
      const res = await appServiceList(this.queryParam);
      if (res.code !== 0) return;
      this.pagination.total = res.data.total ?? 1;
      this.loadData = res.data.list;
      this.loading = false;
    },
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.queryList();
    },

    // 点击编辑
    handleEdit(record) {
      this.visible = true;
      this.editId = record.id;
      this.title = '编辑API服务'
      this.httpServerProtocol = `${record.httpServer.split('://')[0]}://`
      this.websocketServerProtocol =`${record.websocketServer.split('://')[0]}://`
      const httpServer = record.httpServer.split(`://`)[1]
      const websocketServer = record.websocketServer.split(`://`)[1]
      const {
        form: { setFieldsValue },
      } = this;
      this.$nextTick(() => {
        setFieldsValue(
          pick({...record,httpServer,websocketServer}, ["describe","enDescribe","mqttServer","mqttPort","httpServer","areaPhoneNumber","websocketServer","enabled","sid"])
        );
      });
    },

    // 点击新建
    handleNew() {
      this.visible = true;
      this.editId = "";
      this.title = '添加API服务'
      const {
        form: { setFieldsValue },
      } = this;
      this.httpServerProtocol = "http://",
      this.websocketServerProtocol ="wss://"
      this.$nextTick(() => {
        setFieldsValue(
          pick({}, ["describe","enDescribe","mqttServer","mqttPort","httpServer","areaPhoneNumber","websocketServer","enabled","sid"])
        );
      });
    },

    // 确认修改提交
    handleSubmit() {
      const {
        form: { validateFields },
        editId,
      } = this;
      validateFields(async (err, values) => {
        if (err) return;
        let res = null;
        res = editId ? await editAppService({ 
            id: editId, 
            ...values,
            httpServer:`${this.httpServerProtocol}${values.httpServer}`, 
            websocketServer:`${this.websocketServerProtocol}${values.websocketServer}`,
            areaPhoneNumber:`${values.areaPhoneNumber}`
          }) : await addAppService({
            ...values,
            httpServer:`${this.httpServerProtocol}${values.httpServer}`, 
            websocketServer:`${this.websocketServerProtocol}${values.websocketServer}`,
            areaPhoneNumber:`${values.areaPhoneNumber}`
          });
        res.code === 0 ? this.refresh(res) : this.toast(res);
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
      this.form.resetFields();
    },

    async handleEnable(record){
      const res = await setAppServiceStatus({id:record.id,enabled:record.enabled==1 ? 2: 1});
      if(res.code!=0) return
      this.queryList();
    },

    refresh(res) {
      this.toast(res);
      this.handleCancel();
      this.queryList();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-input-number{
  width: 100%;
}
</style>
