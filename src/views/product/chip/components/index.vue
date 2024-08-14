<template>
  <!-- 添加 编辑框 -->
  <a-modal :title="modalTitle" :width="800" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-alert v-if="detailsDisabled" style="margin-bottom: 10px" message="提示：芯片模组启用后禁止编辑" type="warning" banner/>
      <a-form-model ref="ruleForm" :model="form" :rules="detailsDisabled ? {} : rules">
        <a-row>
          <!-- 名称 -->
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称(中文)" prop="moduleName">
              <div v-if="detailsDisabled">{{ form.moduleName }}</div>
              <a-input v-else v-model="form.moduleName" placeholder="请输入名称(中文)"/>
            </a-form-model-item>
          </a-col>
          <!-- 名称 -->
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称(英文)" prop="moduleNameEn">
              <div v-if="detailsDisabled">{{ form.moduleNameEn }}</div>
              <a-input v-else v-model="form.moduleNameEn" placeholder="请输入名称(英文)"/>
            </a-form-model-item>
          </a-col>
          <!-- 关联固件 -->
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="关联固件" prop="firmwareId">
              <a-row :gutter="16">
                <a-col :md="8" :sm="24">
                  <div v-if="detailsDisabled">
                    类型: {{ $DictName("firmware_type", form.firmwareType) }}
                  </div>
                  <a-select v-else v-model="form.firmwareType" @change="onChangeFirType" placeholder="固件类型">
                    <a-select-option v-for="v in $DictList('firmware_type')" :key="v.key" :value="v.key">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24">
                  <div v-if="detailsDisabled">
                    名称: {{ form.firmwareName }}
                  </div>
                  <a-select v-else v-model="form.firmwareId" @change="selectFlag" placeholder="固件名称">
                    <a-select-option :value="v.id" v-for="v in firmwareList" :key="v.id">
                      {{ v.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="8" :sm="24">
                  <div v-if="detailsDisabled">KEY: {{ form.firmwareId }}</div>
                  <a-select v-else v-model="form.firmwareId" @change="selectId" placeholder="固件KEY">
                    <a-select-option v-for="v in firmwareList" :value="v.id" :key="v.id">
                      {{ v.id }}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
              <!-- 详情不显示入口 -->
              <span class="link-a" v-if="!detailsDisabled" @click="linkToPage">
                无对应的固件？立即添加
              </span>
            </a-form-model-item>
          </a-col>
          <!-- 兼容版本 -->
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="兼容版本" prop="versionList">
              <div v-if="detailsDisabled">
                <span style="padding-right: 10px" v-for="value in compatibilityVersionList" :key="value.id">
                  v{{ value.version }}
                </span>
              </div>
              <div v-else>
                <a-checkbox-group style="width: 100%" :value="compatibleVersions" @change="onChangeVersion" v-if="fVList.length">
                  <a-checkbox v-for="value in fVList" :key="value.id" :value="value.id">
                    {{ value.version }}
                  </a-checkbox>
                </a-checkbox-group>
                <div v-else>请先选择固件</div>
              </div>
            </a-form-model-item>
          </a-col>
          <!-- 默认版本 -->
          <a-col>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认版本" prop="defaultVersion">
              <div v-if="detailsDisabled">v{{ form.defaultVersion }}</div>
              <a-select v-else style="width: 50%" placeholder="请选择默认版本" v-model="form.defaultVersion">
                <a-select-option v-for="value in compatibilityVersionList" :key="value.id" :value="value.version">
                  {{ value.version }}
                </a-select-option>
              </a-select>
              <div style="line-height: 12px; color: #ccc" v-if="!detailsDisabled">
                选择一个兼容的版本作为默认版本，将用于开放平台上，提供初始化安装包的下载，方便开发者烧录使用
              </div>
            </a-form-model-item>
          </a-col>
          <!-- 图片 文档 -->
          <a-col :span="12">
            <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="图片" prop="imgUrl">
              <a-input v-show="false" v-model="form.imgUrl" />
              <upload-img
                imgDir="module"
                :imgRequest="true"
                :propsImgSrc="form.imgUrl"
                :disabled="detailsDisabled"
                imgHint="建议80*80像素, png格式最佳,大小不超过1M"
                @ok="handleUploadImg"
              ></upload-img>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="文档" prop="fileUrl" >
              <a-input v-show="false" v-model="form.fileUrl" />
              <upload-file
                fileDir="moduleDoc"
                fileHint="文档为PDF格式，文件不超过20M"
                isRequest
                :disabled="detailsDisabled"
                :download="detailsDisabled"
                :preview="detailsDisabled"
                :fileType="['application/pdf']"
                :propsAccept="['.pdf']"
                :propsFileName="form.fileName"
                :propsFileSrc="form.fileUrl"
                :fileSize="20"
                @ok="onChangeFile"
              ></upload-file>
            </a-form-model-item>
          </a-col>
          <!-- 备注 -->
          <a-col :span="24">
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
              <div v-if="detailsDisabled">{{ form.remark }}</div>
              <input-textarea v-else v-model="form.remark" placeholder="请输入备注"></input-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="back" @click="handleCancel" v-if="!detailsDisabled">
        取消
      </a-button>
      <a-divider type="vertical" v-if="!detailsDisabled" />
      <a-button key="submit" type="primary" @click="handleOk" :loading="confirmLoading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { getChipInfo, addChip, editChip, getFirmwareList, getFirmwareVersionslist} from "@/api/product";
import { ZhNameRules, EnNameRules, CommonRules } from "@/utils/validate";
import { getArrayDataName } from "@/utils/util";
export default {
  data() {
    return {
      // 添加编辑弹框
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 } },
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
      },
      form: {
        moduleName: "",
        moduleNameEn: "",
        firmwareType: "",
        firmwareFlag: "",
        firmwareId: "",
        versionList: [],
        defaultVersion: "",
        imgUrl: "",
        fileUrl: "",
        remark: "",
      },
      rules: {
        moduleName: ZhNameRules("请输入模组中文名称"),
        moduleNameEn: EnNameRules("请输入模组英文名称"),
        firmwareId: CommonRules("请选择固件KEY"),
        versionList: CommonRules("请选择兼容版本", "array"),
        defaultVersion: CommonRules("请选择默认版本"),
        imgUrl: CommonRules("请上传图片"),
        fileUrl: CommonRules("请上传文档"),
      },
      visible: false,
      confirmLoading: false,
      modalTitle: "",
      firmwareList: [],
      // 弹框类型
      modalType: "", // add 添加 details 详情  edit 编辑
      detailsDisabled: false,
      // 固件版本列表
      fVList: [],
      // 已选择的兼容版本列表
      compatibilityVersionList: [],
      // 兼容版本选中项ids
      compatibleVersions: [],
    };
  },
  methods: {
    init(type, id) {
      this.modalType = type;
      this.visible = true;
      this.firmwareList = [];
      this.detailsDisabled = false;
      this.form = {
        imgUrl: "",
        fileUrl: "",
      };
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
      if (type === "add") {
        this.modalTitle = "添加芯片模组";
        return;
      } else if (type === "details") {
        this.detailsDisabled = true; // 详情禁止编辑
        this.modalTitle = "芯片模组详情";
      } else if (type === "edit") {
        this.modalTitle = "编辑芯片模组";
      }
      this.confirmLoading = true;
      getChipInfo(id)
        .then((res) => {
          if (res.code === 0) {
            this.form = res.data;
            if (this.form.status === 1) this.detailsDisabled = true; // 启用后禁止编辑
            this.getFirmwareList(this.form.firmwareType);
            // 回显兼容版本号
            let versions =
              res.data.versionList &&
              res.data.versionList.map((value) => value.versionId);
            // 回显版本相关的内容
            this.setVersions(versions);
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    getFirmwareList(type) {
      getFirmwareList({ query: { status: 1, type } }).then((res) => {
        if (res.code == 0) {
          this.firmwareList = res.data.list;
          // 详情回显展示
          this.form.firmwareName = getArrayDataName(
            this.form.firmwareId,
            res.data.list
          );
        }
      });
    },
    onChangeFirType(type) {
      this.form = {
        ...this.form,
      };
      delete this.form.firmwareId;
      delete this.form.firmwareFlag;
      this.getFirmwareList(type);
      // 还原兼容版本 默认版本的选择
      this.resetVersion();
    },
    selectFlag(e) {
      this.form.firmwareId = e;
      this.firmwareList.forEach((v) => {
        if (v.id == e) {
          this.form.firmwareFlag = v.name;
        }
      });
      this.$refs["ruleForm"].clearValidate(["firmwareId"]);
      // 还原兼容版本 默认版本的选择
      this.resetVersion();
      this.setVersions();
    },
    selectId(e) {
      this.form.firmwareId = e;
      this.firmwareList.forEach((v) => {
        if (v.id == e) {
          this.form.firmwareFlag = v.name;
        }
      });
      this.$refs["ruleForm"].clearValidate(["firmwareId"]);
      // 还原兼容版本 默认版本的选择
      this.resetVersion();
      this.setVersions();
    },
    async setVersions(versions = null) {
      // 获取固件已启用的版本列表
      const res = await getFirmwareVersionslist({
        query: {
          status: 1,
          firmwareId: this.form.firmwareId || "",
        },
      });
      if (res.code != 0) return;
      this.fVList = res.data.list;
      // 如果是编辑详情回显 则执行
      if (versions) this.onChangeVersion(versions);
    },
    // 选择兼容版本
    onChangeVersion(e) {
      this.compatibleVersions = e;
      // 过滤出已选择的兼容版本
      this.compatibilityVersionList = this.fVList.filter((value) =>
        this.compatibleVersions.some((item) => value.id === item)
      );
      this.$set(
        this.form,
        "versionList",
        this.compatibilityVersionList.map((value) => {
          return {
            version: value.version,
            versionId: value.id,
          };
        })
      );
      // 当只有一个兼容版本时 自动选中一个默认版本
      if (this.compatibilityVersionList.length === 1) {
        this.$set(
          this.form,
          "defaultVersion",
          this.compatibilityVersionList[0].version
        );
      }
      // 如果兼容版本中没有默认版本 则清空
      let bl = this.compatibilityVersionList.some(
        (value) => value.version === this.form.defaultVersion
      );
      if (!bl) {
        this.$set(this.form, "defaultVersion", "");
      }
      this.$refs["ruleForm"].clearValidate(["defaultVersion"]);
    },
    handleOk() {
      // 详情 编辑启用状态直接跳过
      if (this.detailsDisabled) {
        this.visible = false;
        return;
      }
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        let res;
        if (!this.form.id) {
          res = await addChip(this.form);
        } else {
          res = await editChip(this.form);
        }
        this.toast(res);
        this.confirmLoading = false;
        if (res.code === 0) {
          this.$emit("ok");
          this.visible = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 图片上传
    handleUploadImg(res) {
      this.$set(this.form, "imgUrl", res.fullPath);
      this.$refs["ruleForm"].clearValidate(["imgUrl"]);
    },
    // 文档上传
    onChangeFile(res) {
      this.$set(this.form, "fileUrl", res.fullPath);
      this.$set(this.form, "fileName", res.name);
      this.$refs["ruleForm"].clearValidate(["fileUrl"]);
    },
    // 重置版本的选择
    resetVersion() {
      this.compatibilityVersionList = [];
      this.compatibleVersions = [];
      this.fVList = [];
      this.$set(this.form, "versionList", []);
      this.$set(this.form, "defaultVersion", "");
    },
    linkToPage() {
      this.visible = false;
      this.$routerPush({
        path: "/product/firmware/details/index?type=add",
        name: "FirmwareDetails",
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
