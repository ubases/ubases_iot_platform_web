<template>
  <div class="aithings-product-details">
    <a-card :bordered="false">
      <a-page-header :title="title" @back="goBack">
        <a-spin :spinning="loading">
          <a-card title="基本信息" :bordered="false">
            <basic-information
              ref="basicInformation"
              :disabled="disabled"
              :productTypeList="productTypeList"
              :formData="form"
              @onChangeProductTypeId="
                (e) => {
                  productTypeId = e;
                  instructList = [];
                  whetherProductKey = true;
                }
              "
            ></basic-information>
          </a-card>
          <a-card title="控制指令" :bordered="false">
            <a-button v-if="detailsType === 'edit' && !disabled" slot="extra" type="primary" @click="resetProductThingModels">重置物模型</a-button>
            <control-instruction
              ref="controlInstruction"
              :productTypeId="productTypeId"
              :disabled="disabled"
              :formData="form"
              :whetherProductKey="whetherProductKey"
              @onChangeInstruction="
                (e) => {
                  instructList = e;
                }
              "
            ></control-instruction>
          </a-card>
          <a-card title="场景条件" :bordered="false">
            <scene-condition
              ref="sceneCondition"
              :instructList="instructList"
              :disabled="disabled"
              :formData="form"
            >
            </scene-condition>
          </a-card>
          <a-card title="控制面板" :bordered="false">
            <control-panel
              ref="controlPanel"
              :productTypeId="productTypeId"
              :productTypeList="productTypeList"
              :disabled="disabled"
              :formData="form"
            ></control-panel>
          </a-card>
          <a-card title="模组选择" :bordered="false">
            <module-component
              ref="moduleComponent"
              :formData="form"
              :disabled="disabled"
              @onChangeModule="
                (e) => {
                  moduleIds = e;
                }
              "
            ></module-component>
          </a-card>
          <a-card title="配网方式" :bordered="false">
            <network-guide
              ref="networkGuide"
              :formData="form"
              :disabled="disabled"
            >
            </network-guide>
          </a-card>
          <a-card :bordered="false">
            <div class="footer-button">
              <a-space>
                <!-- 添加相关 -->
                <template v-if="detailsType === 'add'">
                  <a-button type="primary" @click="saveProduct">
                    保存
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button type="primary" @click="savePublishProduct">
                    保存并发布
                  </a-button>
                </template>
                <!-- 编辑相关 -->
                <template v-if="detailsType === 'edit'">
                  <a-button type="primary" @click="editProduct">
                    更新
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button
                    v-if="form.status !== 1"
                    type="primary"
                    @click="editPublishProduct"
                  >
                    更新发布
                  </a-button>
                </template>
                <template v-if="detailsType === 'details'">
                  <a-button
                    type="primary"
                    :disabled="form.status === 1"
                    @click="switchToEdit"
                  >
                    修改
                  </a-button>
                  <a-divider type="vertical" v-if="form.status === 1" />
                  <a-button
                    type="primary"
                    v-if="form.status === 1"
                    @click="setProductStatus"
                  >
                    停用
                  </a-button>
                  <a-divider
                    type="vertical"
                    v-if="form.status === 0 || form.status === 2"
                  />
                  <a-button
                    type="primary"
                    v-if="form.status === 0 || form.status === 2"
                    @click="setProductStatus"
                  >
                    发布
                  </a-button>
                </template>
                <a-divider type="vertical" />
                <a-button @click="$multiTab.closeCurrentPage()">
                  取消
                </a-button>
              </a-space>
            </div>
          </a-card>
        </a-spin>
      </a-page-header>
    </a-card>
    <set-status-modal ref="setStatusModal" :productTypeList="productTypeList" @ok="init"></set-status-modal>
  </div>
</template>
<script>
import {
  getProductInfo,
  addProduct,
  editProduct,
  getClassificationList,
  resetProductThingModels,
} from "@/api/product";
import NetworkGuide from "../components/NetworkGuide.vue";
import ControlInstruction from "../components/ControlInstruction.vue";
import BasicInformation from "../components/BasicInformation.vue";
import ControlPanel from "../components/ControlPanel.vue";
import Module from "../components/Module.vue";
import Firmware from "../components/Firmware.vue";
import SceneCondition from "../components/SceneCondition.vue";
import SetStatusModal from "../components/SetStatusModal.vue";
import { rmSync } from "fs";
export default {
  name: "ProductDetails",
  components: {
    "network-guide": NetworkGuide,
    "basic-information": BasicInformation,
    "control-instruction": ControlInstruction,
    "control-panel": ControlPanel,
    "module-component": Module,
    "firmware-component": Firmware,
    "scene-condition": SceneCondition,
    "set-status-modal": SetStatusModal,
  },
  data() {
    return {
      form: {},
      current: 0,
      productId: "",
      detailsType: "",
      productTypeId: "",
      disabled: false,
      title: "",
      moduleIds: [],
      instructList: [],
      submitForm: {},
      loading: false,
      productTypeList: [],
      whetherProductKey: false, // 控制指令 产品分类调整的时候不需要productKey
    };
  },
  created() {
    this.setFormStaus(this.$route.query.id, this.$route.query.type);
    this.init();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("addRouterKeepAlive", from.name);
    this.$nextTick(() => {
      next();
    });
  },
  methods: {
    // 获取路由参数
    setFormStaus(id, type) {
      this.productId = id;
      this.detailsType = type;
      this.disabled = false;
      // 详情禁止编辑
      if (this.detailsType === "details") {
        this.disabled = true;
        this.title = "产品类型详情";
      } else if (this.detailsType === "add") {
        this.title = "添加产品类型";
      } else if (this.detailsType === "edit") {
        this.title = "编辑产品类型";
      }
      this.$route.meta.title = this.title;
    },
    async init() {
      // 产品分类
      let res = await getClassificationList({});
      if (res.code === 0) {
        // 只显示有子集的产品分类
        this.productTypeList = res.data.list.filter(item => {
          return item.children && item.children.length
        });
      }
      if (!this.productId) return;
      this.getProductInfo()
    },

    async getProductInfo(){
      // 产品详情
      this.loading = true;
      let result = await getProductInfo({ id: this.productId });
      if (result.code === 0) {
        // 产品类型-控制指令模块列表需要过滤
        result.data.thingModels = (result.data.thingModels || []).filter(
          (v) => v.valid
        );
        this.form = result.data;
        this.productTypeId = result.data.productTypeId;
        this.instructList = this.form.thingModels;
        this.moduleIds = this.form.moduleIds;
        // 已发布禁止编辑;
        if (this.form.status === 1) this.disabled = true;
        this.loading = false;
      }
    },

    // 产品保存
    saveProduct() {
      this.setData(() => {
        this.loading = true;
        this.submitForm.isPublish = 0;
        addProduct(this.submitForm).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.$multiTab.closeCurrentPage();
          }
          this.loading = false;
        });
      });
    },
    // 产品保存发布
    savePublishProduct() {
      this.setData(() => {
        this.loading = true;
        this.submitForm.isPublish = 1;
        addProduct(this.submitForm).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.$multiTab.closeCurrentPage();
          }
          this.loading = false;
        });
      });
    },
    // 产品编辑
    editProduct() {
      this.setData(() => {
        this.loading = true;
        this.submitForm.id = this.productId;
        editProduct(this.submitForm).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.$route.query.type === "details"
              ? this.setFormStaus(this.$route.query.id, this.$route.query.type)
              : this.$multiTab.closeCurrentPage();
          }
          this.loading = false;
        });
      });
    },
    // 产品编辑发布
    editPublishProduct() {
      this.setData(() => {
        this.loading = true;
        this.submitForm.isPublish = 1;
        this.submitForm.id = this.productId;
        editProduct(this.submitForm).then((res) => {
          this.toast(res);
          if (res.code === 0) {
            this.$route.query.type === "details"
              ? this.setFormStaus(this.$route.query.id, this.$route.query.type)
              : this.$multiTab.closeCurrentPage();
          }
          this.loading = false;
        });
      });
    },

    setData(callback) {
      let thingModels = this.$refs["controlInstruction"].instructRows;
      if (thingModels.length === 0) {
        this.$message.warning("请选择控制指令");
        return;
      }
      if (this.$refs["controlInstruction"].disabledForm) {
        this.$message.warning("有必选的控制指令未选择");
        return;
      }
      let controlPanelIds = this.$refs["controlPanel"].controlPanelRows.map(
        (v) => v.id
      );
      if (controlPanelIds.length === 0) {
        this.$message.warning("请选择控制面板");
        return;
      }
      let moduleIds = this.$refs["moduleComponent"].moduleRows.map((v) => v.id);
      if (moduleIds.length === 0) {
        this.$message.warning("请选择模组");
        return;
      }
      let firmwareIds = this.$refs["moduleComponent"].moduleRows.map((v) => v.firmwareId);
      let networkGuides = this.$refs["networkGuide"].networkGuides.filter(
        (v) => v.bl
      );
      if (networkGuides.length === 0) {
        this.$message.warning("请选择配网方式");
        return;
      }
      this.$refs["basicInformation"].verifyForm(() => {
        let form = this.$refs["basicInformation"].form;
        this.submitForm = {
          ...this.form,
          ...form,
          moduleIds,
          firmwareIds,
          controlPanelIds,
          thingModels,
          networkGuides,
        };
        callback();
      });
    },
    // 修改产品状态
    setProductStatus() {
      let msg = "";
      let status = null;
      if (this.form.status == 0 || this.form.status == 2) {
        this.setData(() => {
          status = 1;
          msg = "确认发布吗?";
          this.$refs["setStatusModal"].init(msg, this.form, status);
        })
      } else {
        status = 2;
        msg = "确认停用吗?";
        this.$refs["setStatusModal"].init(msg, this.form, status);
      }
      
    },
    // 切换到编辑状态
    switchToEdit() {
      this.setFormStaus(this.$route.query.id, "edit");
    },
    goBack() {
      this.$multiTab.closeCurrentPage();
    },

    // 重置物模型
    async resetProductThingModels(){
      const res = await resetProductThingModels({productId:this.productId})
      if(res.code !== 0) return
      this.toast(res);
      this.$refs.controlInstruction.init()
      this.getProductInfo()
    }
  },
};
</script>
<style lang="less" scoped>
.footer-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
