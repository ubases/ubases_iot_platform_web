<template>
  <div class="aithings-basic-information">
    <a-form-model ref="ruleForm" :model="form" :rules="disabled ? {} : rules">
      <!-- 名称中文  名称英文 -->
      <a-row>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="名称(中文)"
            prop="name"
          >
            <div v-if="disabled">{{ form.name }}</div>
            <a-input
              v-else
              v-model="form.name"
              placeholder="请输入名称(中文)"
            />
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="名称(英文)"
            prop="nameEn"
          >
            <div v-if="disabled">{{ form.nameEn }}</div>
            <a-input
              v-else
              v-model="form.nameEn"
              placeholder="请输入名称(英文)"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-if="disabled">
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="产品类型KEY"
            prop="productKey"
          >
            <div>{{ form.productKey }}</div>
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="状态"
            prop="status"
          >
            <div>{{ $DictName('product_release',form.status) }}</div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 产品分类  通讯协议 -->
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="产品分类"
            prop="productTypeIdPath"
          >
            <div v-if="disabled">{{ form.productTypeName }}</div>
            <!-- 编辑情况下 禁止编辑产品分类 -->
            <a-cascader
              v-else
              v-model="form.productTypeIdPath"
              :disabled="$route.query.type === 'edit'"
              :allowClear="false"
              :options="productTypeList"
              :display-render="displayRender"
              :fieldNames="replaceFields"
              expand-trigger="hover"
              placeholder="请选择产品分类"
              @change="onChangeProductTypeId"
            />
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="通讯协议"
            prop="networkType"
          >
            <div v-if="disabled">
              {{ $DictName("network_type", form.networkType) }}
            </div>
            <a-select
              v-else
              v-model="form.networkType"
              placeholder="请选择通讯协议"
            >
              <a-select-option
                v-for="v in $DictList('network_type')"
                :key="v.key"
                :value="v.key"
              >
                {{ v.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- WIFI标识  设备性质 -->
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="WIFI标识"
            prop="wifiFlag"
          >
            <div v-if="disabled">{{ form.wifiFlag }}</div>
            <a-input
              v-else
              v-model="form.wifiFlag"
              placeholder="请输入WIFI标识"
            />
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="设备性质"
            prop="attributeType"
          >
            <div v-if="disabled">
              {{ $DictName("device_nature", form.attributeType) }}
            </div>
            <a-select
              v-else
              v-model="form.attributeType"
              placeholder="请选择设备性质"
            >
              <a-select-option
                v-for="v in $DictList('device_nature')"
                :key="v.key"
                :value="v.key"
              >
                {{ v.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 虚拟测试  功耗 -->
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="虚拟测试"
            prop="isVirtualTest"
          >
            <div v-if="disabled">
              {{ $DictName("Is_virtual_test", form.isVirtualTest) }}
            </div>
            <a-radio-group v-else v-model="form.isVirtualTest">
              <a-radio
                v-for="v in $DictList('Is_virtual_test')"
                :key="v.key"
                :value="v.key"
              >
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="功耗"
            prop="powerConsumeType"
          >
            <div v-if="disabled">
              {{ $DictName("power_consume_type", form.powerConsumeType) }}
            </div>
            <a-radio-group v-else v-model="form.powerConsumeType">
              <a-radio
                v-for="v in $DictList('power_consume_type')"
                :key="v.key"
                :value="v.key"
              >
                {{ v.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 图标 备注 -->
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="图标"
            prop="imageUrl"
          >
            <a-input v-show="false" v-model="form.imageUrl" />
            <upload-img
              imgDir="product"
              :imgSizeMode="2"
              :imgRequest="true"
              :propsImgSrc="form.imageUrl"
              :disabled="disabled"
              imgHint="建议80*80像素,比例必须1:1,png格式最佳,大小不超过1M"
              @ok="handleUploadImg"
            ></upload-img>
          </a-form-model-item>
        </a-col>
        <a-col v-bind="colFlex">
          <a-form-model-item
            :label-col="two.labelCol"
            :wrapper-col="two.wrapperCol"
            label="备注"
          >
            <div v-if="disabled">{{ form.remark }}</div>
            <input-textarea
              v-else
              v-model="form.remark"
              :maxLength="500"
              placeholder="请输入备注"
            ></input-textarea>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
import {
  ZhNameRules,
  EnNameRules,
  WifiRules,
  CommonRules,
} from "@/utils/validate";
export default {
  props: {
    productTypeList: {
      type: Array,
      default: ()=>[],
    },
    formData: {
      type: Object,
      default: {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 添加编辑弹框
      two: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      colFlex: {
        xl: 12,
        lg: 24,
        md: 24,
        sm: 24,
      },
      form: {
        productTypeId: "",
        productTypeIdPath: [],
        name: "",
        nameEn: "",
        imageUrl: "",
        wifiFlag: "",
        isVirtualTest: 1,
        powerConsumeType: 1,
        desc: "",
      },
      rules: {
        productTypeIdPath: CommonRules("请选择产品分类", "array"),
        name: ZhNameRules("请填写中文名"),
        nameEn: EnNameRules("请填写英文名"),
        wifiFlag: WifiRules("请填写wifi标识"),
        networkType: CommonRules("请选择通讯协议", "number"),
        attributeType: CommonRules("请选择设备性质", "number"),
        isVirtualTest: CommonRules("请选择是否支持虚拟测试", "number"),
        powerConsumeType: CommonRules("请选择功耗", "number"),
        imageUrl: CommonRules("请上传图片"),
      },
      // 上级菜单选择相关
      replaceFields: {
        children: "children",
        label: "name",
        key: "id",
        value: "id",
      },
    };
  },
  watch: {
    formData: function (newData, oldData) {
      if (newData && newData.id) {
        this.form = {...newData};
        // 详情展示回显
        this.getProductTypeName(this.productTypeList);
      }
    },
  },
  methods: {
    getProductTypeName(data) {
      return data.some((value) => {
        if (value.id === this.formData.productTypeId) {
          this.form.productTypeName = value.name;
          return true;
        } else if (value.children && value.children.length) {
          return this.getProductTypeName(value.children);
        }
      });
    },
    // 图片上传
    async handleUploadImg(res) {
      this.$set(this.form, "imageUrl", res.fullPath);
      this.$refs["ruleForm"].clearValidate(["imageUrl"]);
    },
    onChangeProductTypeId(e) {
      this.form.productTypeId = e[e.length - 1];
      this.$emit("onChangeProductTypeId", this.form.productTypeId);
    },
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },
    verifyForm(callback) {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          callback();
        } else {
          this.$message.warning("基础信息填写不完整");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
