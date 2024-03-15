<template>
  <a-row :gutter="16">
    <a-card :bordered="false">
      <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
        <a-spin :spinning="confirmLoading">
          <a-card :title="$t('firmware.baseMsg')" :bordered="false">
            <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="formDisabled ? {} : rules" >
              <!-- 名称  标识 -->
              <a-form-model-item :label="$t('firmware.firmwareName')" prop="name">
                <div v-if="formDisabled">{{ form.name }}</div>
                <a-input v-else v-model="form.name" placeholder="请输入固件名称(中文)"/>
              </a-form-model-item>
              <a-form-model-item label="固件名称(英文)" prop="nameEn">
                <div v-if="formDisabled">{{ form.nameEn }}</div>
                <a-input v-else v-model="form.nameEn" placeholder="请输入固件名称(英文)" />
              </a-form-model-item>
              <a-form-model-item label="固件key" v-if="formDisabled">
                <div>{{ form.id }}</div>
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.flag')" prop="flag">
                <div v-if="formDisabled">{{ form.flag }}</div>
                <a-input v-else v-model="form.flag" placeholder="请输入固件标识" />
              </a-form-model-item>
              <!-- 固件类型 -->
              <a-form-model-item :label="$t('firmware.type')" prop="type">
                <div v-if="formDisabled">
                  {{ $DictName("firmware_type", form.type) }}
                </div>
                <a-select v-else v-model="form.type" placeholder="请选择固件类型" :disabled="type !== 'add'">
                  <a-select-option v-for="v in $DictList('firmware_type')" :key="v.key" :value="v.key" >{{ v.label }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <!-- Flash大小  升级超时时间 -->
              <a-form-model-item :label="$t('firmware.flashSize')" prop="flashSize">
                <div v-if="formDisabled">
                  {{ $DictName("flash_size", form.flashSize) }}
                </div>
                <a-select v-else v-model="form.flashSize" placeholder="请选择Flash大小">
                  <a-select-option v-for="v in $DictList('flash_size')" :key="v.key" :value="v.key">
                    {{ v.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.upgradeOvertime')" prop="upgradeOvertime">
                <span v-if="formDisabled">{{ form.upgradeOvertime }}</span>
                <a-input-number
                  v-else
                  v-model="form.upgradeOvertime"
                  :min="1"
                  :max="300"
                  :precision="0"
                  style="width: 70%"
                  placeholder="请输入升级超时时间,1~300"
                />
                <span class="ant-form-text">{{ $t("firmware.second") }}</span>
                <br />
                <span v-if="!formDisabled" style="color: #ccc">最多300秒</span>
              </a-form-model-item>
              <!-- 备注  版本号 -->
              <a-form-model-item :label="$t('public.remark')">
                <div v-if="formDisabled">{{ form.remark }}</div>
                <input-textarea v-else v-model="form.remark" placeholder="请输入备注"></input-textarea>
              </a-form-model-item>
              <a-form-model-item v-if="type === 'add'" :label="$t('firmware.version')" prop="version">
                <a-input v-model="form.version" placeholder="例如：1.0.1" />
                <div style="color: #ccc">版本号格式：xx.xx.xx</div>
              </a-form-model-item>
              <a-form-model-item v-if="type === 'add'" label="版本描述" prop="desc">
                <input-textarea v-model="form.desc" @input="$refs['ruleForm'].clearValidate(['desc'])" placeholder="请输入版本描述"></input-textarea>
              </a-form-model-item>
              <a-form-model-item v-if="type === 'add'" label="资源包" prop="zipFileName">
                <a-input v-show="false" v-model="form.zipFileName" />
                <upload-file
                  fileDir="firmwareDoc"
                  fileIcon="folder"
                  fileHint="zip格式文件"
                  :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
                  :propsAccept="['.zip']"
                  :propsFileName="form.zipFileName"
                  :propsFileSrc="form.zipFilePath"
                  :fileSize="10"
                  :isRequest="true"
                  @ok="$e=>onChangeFile($e,'zip')"
                ></upload-file>
              </a-form-model-item>
              <a-form-model-item v-if="type === 'add'" label="OTA包" prop="fileName">
                <a-input v-show="false" v-model="form.fileName" />
                <upload-file
                  fileDir="firmwareDoc"
                  fileIcon="folder"
                  fileHint="固件为bin格式,且不超过10M"
                  :fileType="['application/x-zip-compressed','application/octet-stream','application/zip','application/x-zip']"
                  :propsAccept="['.bin']"
                  :propsFileName="form.fileName"
                  :propsFileSrc="form.filePath"
                  :fileSize="10"
                  :isRequest="true"
                  @ok="$e=>onChangeFile($e,'bin')"
                ></upload-file>
              </a-form-model-item>
              <a-form-model-item v-if="type === 'add'" label="关键版本" prop="isMust">
                <a-radio-group v-model="form.isMust" :options="$DictList('yes_no')" />
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
                <a-button v-if="formDisabled" type="primary" @click="editForm">
                  {{ $t("public.update") }}
                </a-button>
                <a-divider type="vertical" v-if="formDisabled" />
                <a-button v-if="!formDisabled && (type === 'edit' || type === 'details')" type="primary" @click="sumitEdit">
                  {{ $t("public.ok") }}
                </a-button>
                <a-divider type="vertical" v-if="!formDisabled && (type === 'edit' || type === 'details')"/>
                <a-button v-if="!formDisabled && type === 'add'" type="primary" @click="sumitAdd">
                  {{ $t("public.ok") }}
                </a-button>
                <a-divider type="vertical" v-if="!formDisabled && type === 'add'"/>
                <a-button v-if="(type === 'edit' || type === 'details') && form.status == 1" type="primary" @click="setFirmwareStatus(form)">
                  停用
                </a-button>
                <a-divider type="vertical" v-if="(type === 'edit' || type === 'details') && form.status == 1"/>
                <a-button v-if="(type === 'edit' || type === 'details') && form.status == 2" type="primary" @click="setFirmwareStatus(form)">
                  启用
                </a-button>
                <a-divider type="vertical" v-if="(type === 'edit' || type === 'details') && form.status == 2"/>
                <a-button @click="$multiTab.closeCurrentPage()">
                  {{ $t("public.back") }}
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-card>
        </a-spin>
        <a-card v-if="type == 'edit' || type == 'details'" :title="$t('firmware.versionMsg')" :bordered="false">
          <!-- 表格操作栏 -->
          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAdd()">
              添加版本
            </a-button>
          </div>
          <!-- 表格 -->
          <a-table
            size="small"
            rowKey="id"
            :data-source="dataSource"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            @change="onChangePagination"
          >
            <template slot="version" slot-scope="text, record">
              <a-button size="small" type="link" @click="showInfo(record)">
                {{ record.version }}
              </a-button>
            </template>
            <template slot="createdAt" slot-scope="text, record">
              <span>{{ record.createdAt | momentFilter }}</span>
            </template>
            <template slot="fileSize" slot-scope="text, record">
              <span>{{ Number(record.fileSize/1024).toFixed(2) + 'kb' }}</span>
            </template>
            <template slot="status" slot-scope="text, record">
              <span>{{ $DictName("version_status", record.status) }}</span>
            </template>
            <template v-slot:action="item">
              <a-button :disabled="item.status == 1" type="link" size="small" icon="edit" @click="handleEdit(item)">
                {{ $t("public.edit") }}
              </a-button>
              <a-divider type="vertical" v-if="item.status == 1" />
              <a-button v-if="item.status == 1" type="link" size="small" icon="setting" @click="handleSet(item)">
                下架
              </a-button>
              <a-divider type="vertical" v-if="item.status == 2" />
              <a-button v-if="item.status == 2" type="link" size="small" icon="setting" @click="handleSet(item)">
                上架
              </a-button>
            </template>
          </a-table>
        </a-card>
      </a-page-header>
    </a-card>
    <!-- 编辑框版本信息 -->
    <edit-version ref="versionForm" @ok="getFirmwareList"> </edit-version>
    <!-- 版本详细框 -->
    <version-info ref="versionInfo"></version-info>
    <!-- 上架确认框 -->
    <putaway-modal ref="putawayModal" @ok="getFirmwareList"></putaway-modal>
  </a-row>
</template>
<script>
import { editFirmware, firmwareDetails, addFirmware, getFirmwareVersionslist, setFirmwareStatus, versionsUnShelf} from "@/api/product";
import EditVersion from "../components/EditVersion.vue";
import VersionInfo from "../components/VersionInfo.vue";
import PutawayModal from "../components/PutawayModal.vue";
import { VersionRules, CommonRules, EnNameRules, ZhNameRules, EnNumberRules} from "@/utils/validate";
export default {
  name: "FirmwareDetails",
  components: {
    "edit-version": EditVersion,
    "version-info": VersionInfo,
    "putaway-modal": PutawayModal,
  },
  data() {
    return {
      title: "",
      // 编辑
      id: "",
      type: "",
      form: {
        name: "",
        nameEn: "",
        flag: "",
        type: undefined,
        flashSize: undefined,
        upgradeOvertime: "",
        remark: "",
        version: "",
        // 固件版本相关
        filePath: "",
        fileSize: "",
        fileKey: "",
        fileName: "",
      },
      confirmLoading: false,
      formDisabled: true,
      labelCol: { xs: { span: 24 }, sm: { span: 3 },},
      wrapperCol: { xs: { span: 24 }, sm: { span: 8 },},
      rules: {
        name: ZhNameRules(this.$t("firmware.inputName")),
        nameEn: EnNameRules(this.$t("firmware.inputName")),
        flag: EnNumberRules(this.$t("firmware.inputFlag")),
        type: CommonRules(this.$t("firmware.inputType"), "number"),
        flashSize: CommonRules(this.$t("firmware.inputFlashSize"), "number"),
        upgradeOvertime: CommonRules(this.$t("firmware.inputUpgradeTime"),"number"),
        version: VersionRules(this.$t("firmware.inputVersionName")),
        desc: CommonRules("请输入版本描述"),
        zipFileName: CommonRules("请上传资源包"),
        fileName: CommonRules("请上传OTA包"),
        isMust:CommonRules("请选择是否关键版本",'number'),
      },
      // 表格
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) =>
          `总数:${total} 当前:${range[0]}-${range[1]}`,
      },
      queryParam: {
        page: 1,
        limit: 10,
        query: {
          firmwareId: "",
        },
      },
      loading: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "version",
          title: this.$t("firmware.version"),
          scopedSlots: { customRender: "version" },
        },
        {
          dataIndex: "desc",
          title: this.$t("firmware.versionDetails"),
          ellipsis: true,
        },
        {
          dataIndex: "fileSize",
          title: this.$t("firmware.size"),
          scopedSlots: { customRender: "fileSize" },
        },
        {
          dataIndex: "createdAt",
          title: this.$t("firmware.updateTime"),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          dataIndex: "status",
          title: this.$t("public.status"),
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.queryParam.query.firmwareId = this.id;
    this.type = this.$route.query.type;
    this.formDisabled = false;
    if (this.type === "add") {
      this.title = "添加固件";
    } else if (this.type === "details") {
      this.title = "固件详情";
      this.formDisabled = true;
      this.getFirmwareDetails();
      this.getFirmwareList();
    } else if (this.type === "edit") {
      this.title = "编辑固件";
      this.getFirmwareDetails();
      this.getFirmwareList();
    }
    this.$route.meta.title = this.title;
  },
  methods: {
    showInfo(data) {
      this.$refs["versionInfo"].init(data);
    },
    // 获取固件详情
    async getFirmwareDetails() {
      const res = await firmwareDetails(`${this.id}`);
      if (res.code !== 0) return;
      this.form = res.data;
    },
    // 固件版本列表
    async getFirmwareList() {
      this.loading = true;
      const res = await getFirmwareVersionslist(this.queryParam);
      this.loading = false;
      if (res.code != 0) return;
      this.dataSource = res.data.list;
      this.pagination.total = res.data.total;
    },
    // 修改固件状态
    handleSet(e) {
      if (e.status == 2) {
        this.$refs["putawayModal"].init(e, this.form);
      } else if (e.status == 1) {
        this.$confirm({
          content: "是否确定下架!",
          onOk: () => {
            // 下架
            versionsUnShelf({
              id: e.id,
            }).then((res) => {
              if (res.code == 0) {
                this.getFirmwareList();
                this.toast(res);
              } else {
                this.toast("本版本已与模组关联，请先解除关联关系");
              }
            });
          },
        });
      }
    },
    // 版本列表分页
    onChangePagination(e) {
      this.queryParam.limit = e.pageSize;
      this.queryParam.page = e.current;
      this.pagination.current = e.current;
      this.pagination.pageSize = e.pageSize;
      this.getFirmwareList();
    },
    // 固件编辑后提交
    sumitEdit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        const res = await editFirmware(this.form);
        this.confirmLoading = false;
        this.toast(res);
        if ((this.type === "edit" || this.type === "add") && res.code === 0) {
          this.$multiTab.closeCurrentPage();
        } else if (this.type === "details" && res.code === 0) {
          this.formDisabled = true;
          this.title = "固件详情";
          this.$route.meta.title = this.title;
        }
      });
    },
    // 编辑版本
    handleEdit(e) {
      let data = {
        newVersion: this.form.version,
        firmwareName: this.form.name,
        firmwareId: this.form.id,
        isMust: e.isMust,
        version: e.version,
        desc: e.desc,
        status: e.status,
        id: e.id,
        zipFileKey: e.zipFileKey,
        zipFileName: e.zipFileName,
        zipFilePath: e.zipFilePath,
        zipFileSize: e.zipFileSize,
        filePath: e.filePath,
        fileSize: e.fileSize,
        fileKey: e.fileKey,
        fileName: e.fileName,
       
      };
      this.$refs["versionForm"].init("edit", data);
    },
    // 添加固件
    sumitAdd() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        addFirmware(this.form).then((res) => {
          if (res.code == 0) {
            this.$multiTab.closeCurrentPage();
          }
          this.confirmLoading = false;
          this.toast(res);
        });
      });
    },
    editForm() {
      this.formDisabled = false;
      this.title = "编辑固件";
      this.$route.meta.title = this.title;
    },
    // 文档上传后的内容
    onChangeFile(res,type) {
      if(type === 'bin'){
        this.$set(this.form, "filePath", res.fullPath);
        this.$set(this.form, "fileKey", res.key);
        this.$set(this.form, "fileSize", res.size);
        this.$set(this.form, "fileName", res.name);
        this.$refs["ruleForm"].clearValidate(["fileName"]);
      } else if(type==='zip'){
        this.$set(this.form, "zipFilePath", res.fullPath);
        this.$set(this.form, "zipFileKey", res.key);
        this.$set(this.form, "zipFileSize", res.size);
        this.$set(this.form, "zipFileName", res.name);
        this.$refs["ruleForm"].clearValidate(["zipFileName"]);
      }
     
    },
    // 添加版本
    handleAdd() {
      let data = {
        newVersion: this.form.version,
        firmwareName: this.form.name,
        firmwareId: this.form.id,
        isMust: this.form.isMust,
        status: 2, // 默认禁用
      };
      this.$refs["versionForm"].init("add", data);
    },
    // 修改状态
    setFirmwareStatus(e) {
      let msg = "";
      let status = null;
      if (e.status == 2) {
        status = 1;
        msg = "是否启用固件";
      } else {
        status = 2;
        msg = "是否停用固件";
      }
      this.$UpdateStatus(this, msg).then((res) => {
        let data = {
          id: e.id,
          status,
        };
        setFirmwareStatus(data).then((res) => {
          if (res.code == 0) {
            this.$multiTab.closeCurrentPage();
          }
          this.toast(res);
        });
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
