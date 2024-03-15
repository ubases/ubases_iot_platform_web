<template>
  <a-card>
    <a-page-header title="字典详情" @back="$multiTab.closeCurrentPage()">
      <!-- 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="20">
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input
                  v-model="queryParam.dictLabel"
                  :placeholder="$t('dicItem.name')"
                  :allowClear="true" 
                  @keyup.enter.native="handleSearch"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <a-form-item>
                <a-input 
                disabled 
                v-model="queryParam.dictType" />
              </a-form-item>
            </a-col>
            <a-col v-bind="aColFlex">
              <span class="table-page-search-submitButtons">
                <a-button icon="search" type="primary" @click="handleSearch">
                  {{ $t("public.search") }}
                </a-button>
                <a-divider type="vertical" />
                <a-button icon="redo" @click="reset"> 重置 </a-button>
                <a-divider type="vertical" />
                <a-button
                  v-if="code"
                  type="primary"
                  icon="plus"
                  @click="handleNew"
                >
                  {{ $t("public.add") }}
                </a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="dictId"
        :data-source="loadData"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template slot="action" slot-scope="text, record">
          <a-button
            type="link"
            size="small"
            icon="edit"
            @click="handleEdit(record)"
          >
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            size="small"
            icon="delete"
            @click="handleDel(record)"
          >
            {{ $t("public.delete") }}
          </a-button>
        </template>
      </a-table>
      <!-- 表格添加编辑框 -->
      <a-modal
        :width="800"
        :title="title"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
      >
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="ruleForm" :model="form" :rules="rules">
            <!-- 下面三个不需要参与编辑 -->
            <a-form-model-item
              v-show="false"
              label="拼音"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input type="text" :maxLength="100" v-model="form.pinyin" />
            </a-form-model-item>
            <a-form-model-item
              v-show="false"
              label="首字母"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="text"
                :maxLength="100"
                v-model="form.firstletter"
              />
            </a-form-model-item>
            <a-form-model-item
              v-show="false"
              label="扩展值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input type="text" :maxLength="100" v-model="form.extvalue" />
            </a-form-model-item>
            <!-- 上面三个不需要参与编辑 -->
            <a-form-model-item
              label="编码"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                type="text"
                disabled
                :maxLength="100"
                v-model="form.dictType"
              />
            </a-form-model-item>
            <a-form-model-item
              label="名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="dictLabel"
            >
              <a-input
                type="text"
                @input="changeValue"
                v-model="form.dictLabel"
                placeholder="请输入名称"
              />
            </a-form-model-item>
            <a-form-model-item
              label="值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="dictValue"
            >
              <a-input
                type="text"
                style="width: 100%"
                v-model="form.dictValue"
                :min="1"
                :max="100000"
                placeholder="请输入值"
              />
            </a-form-model-item>
            <a-form-model-item
              label="排序"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number
                style="width: 100%"
                :min="1"
                :max="999"
                :precision="0"
                v-model="form.dictSort"
                placeholder="请输入排序, 1~999"
              />
            </a-form-model-item>
            <a-form-model-item
              label="图标"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input type="text" v-show="false" v-model="form.listimg" />
              <upload-img
                imgDir="dic"
                :imgRequest="true"
                :propsImgSrc="form.listimg"
                imgHint="png格式最佳,大小不超过1M"
                @ok="handleUploadImg"
              ></upload-img>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
        <template #footer>
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-divider type="vertical" />
          <a-button
            key="submit"
            type="primary"
            @click="handleSubmit"
            :loading="confirmLoading"
          >
            确定
          </a-button>
        </template>
      </a-modal>
    </a-page-header>
  </a-card>
</template>
<script>
import {
  getDictList,
  deleteDict,
  addDict,
  updateDict,
} from "@/api/dictionaries";
import vPinyin from "@/utils/vue-py";
import pick from "lodash.pick";
import SetLanguage from "../components/SetLanguage.vue";
export default {
  name: "DictionariesDetails",
  components: {
    "set-language": SetLanguage,
  },
  data() {
    return {
      loading: false,
      queryParam: {
        dictLabel: "",
        dictType: "",
      },
      columns: [
        {
          title: this.$t("dicItem.name"),
          dataIndex: "dictLabel",
          ellipsis: true,
        },
        {
          title: this.$t("dicItem.itemcode"),
          dataIndex: "dictType",
          ellipsis: true,
        },
        {
          title: this.$t("dicItem.pinyin"),
          dataIndex: "pinyin",
          ellipsis: true,
        },
        {
          title: this.$t("dicItem.firstletter"),
          dataIndex: "firstletter",
        },
        {
          title: this.$t("dicItem.value"),
          dataIndex: "dictValue",
        },
        {
          title: "排序",
          dataIndex: "dictSort",
        },
        {
          title: this.$t("public.action"),
          dataIndex: "action",
          align: "center",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loadData: [],
      // 表单添加编辑
      form: {},
      id: "",
      title: "",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
      rules: {
        dictLabel: [
          {
            required: true,
            validator: (rule, value, cabblack) => {
              if (!value) {
                cabblack(this.$t("dicItem.input_name"));
              } else if (!value.trim().length) {
                cabblack(this.$t("dicItem.input_name"));
              } else if (value.replace(/[^\x00-\xff]/g, "aa").length > 100) {
                cabblack("名称长度过长");
              }
              cabblack();
            },
          },
        ],
        dictValue: [{ required: true, message: "请输入值" }],
      },
      confirmLoading: false,
      visible: false,
      editRecord: {},
      code: "",
    };
  },

  mounted() {
    this.code = this.$route.query.code || '';
    if(!this.code) return
    this.queryParam.dictType = this.code;
    this.queryList();
  },
  watch:{
    '$route.query': function (){
      const code = this.$route.query.code || '';
      if(!code || code === this.code) return
      this.code = code
      this.queryParam.dictType = this.code;
      this.queryList();
    }
  },
  // mounted() {},
  methods: {
    reset() {
      this.queryParam.dictLabel = "";
      this.queryList();
    },
    handleSearch() {
      this.queryList();
    },
    queryList() {
      this.loading = true;
      getDictList(this.queryParam)
        .then((res) => {
          if (res.code !== 0) return;
          this.loadData = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleDel(record) {
      this.$Delete(this, record.dictLabel).then(() => {
        deleteDict(record.dictId).then((res) => {
          this.toast(res);
          this.queryList();
        });
      });
    },
    handleEdit(record) {
      this.visible = true;
      this.editRecord = record; // 有的值不能编辑 需要后期合并没被编辑的值
      this.id = record.dictId;
      this.title = this.$t("dicItem.edit");
      this.form = {
        dictLabel: record.dictLabel,
        dictType: record.dictType,
        code: record.code,
        pinyin: record.pinyin,
        extvalue: record.extvalue || "",
        dictValue: record.dictValue,
        firstletter: record.firstletter,
        listimg: record.listimg,
        dictSort: record.dictSort,
      };
    },
    handleNew() {
      this.visible = true;
      this.id = "";
      this.title = this.$t("dic.add");
      this.form = {
        dictType: this.queryParam.dictType,
      };
    },
    handleSubmit() {
      let id = this.id;
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        if (!id) {
          addDict({ ...this.form, code: this.code })
            .then((res) => {
              if (res.code == 0) {
                this.refresh(res);
              } else {
                this.failed(res);
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          updateDict({
            id,
            ...this.editRecord,
            ...this.form,
            code: this.code,
          })
            .then((res) => {
              if (res.code == 0) {
                this.refresh(res);
              } else {
                this.failed(res);
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    handleCancel() {
      this.id = "";
      this.visible = false;
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();
    },
    failed(err) {
      this.toast(err);
    },
    refresh(res) {
      this.toast(res);
      this.handleCancel();
      this.queryList();
    },
    handleUploadImg(res) {
      this.$set(this.form, "listimg", res.fullPath);
    },
    changeValue() {
      let value = this.form.dictLabel;
      // 校验的字段
      this.$refs["ruleForm"].validateField("dictLabel", (valid) => {
        if (valid) return;
        // 中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
        const cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/;
        const maxLimitStr = 100; // 50个汉字
        let pass = true;
        let substringStr = "";
        let length = 0;
        const strArr = value.split("");
        if (value.indexOf("'") != -1) {
          return;
        }
        strArr.map((str) => {
          if (pass) {
            if (cnReg.test(str)) {
              // 中文
              length++;
            } else {
              // 英文
              length += 0.5;
            }
            // 大于最大限制的时候
            if (length > maxLimitStr) {
              pass = false;
              // 将校验的字符截取返回
              this.form.dictLabel = substringStr;
            } else {
              substringStr += str;
            }
          }
        });
        if (substringStr) {
          var pinyinVal = vPinyin.chineseToPinYin(substringStr).toUpperCase();
          this.form.pinyin = pinyinVal;
          if (pinyinVal) {
            this.form.firstletter = pinyinVal[0];
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
