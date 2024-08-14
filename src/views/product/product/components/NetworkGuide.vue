<template>
  <div>
    <div class="networkGuide-data" v-for="(v, i) in networkGuides" :key="i">
      <a-checkbox :disabled="disabled" v-model="v.bl" v-if="v.type != 2">
        <div class="networkGuide-text">
          {{ $DictName("network_guide", v.type) }}
        </div>
        <a-button
          type="primary"
          :disabled="!v.bl"
          @click="selectNetworkGuide(v, i)"
        >
          配网文案
        </a-button>
      </a-checkbox>
    </div>
    <a-modal
      title="配网文案"
      :width="640"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <div class="modal-content">
          <div v-for="(v, i) in netList.steps" :key="i">
            <div class="writer-header">
              <div>步骤{{ i + 1 }}</div>
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                :disabled="disabled"
                @click="deleteWriter(i)"
              ></a-button>
            </div>
            <a-form-model ref="ruleForm" :rules="rules" :model="v">
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="中文文案"
                    prop="instruction"
                  >
                    <a-input :disabled="disabled" v-model="v.instruction" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="英文文案"
                    prop="instructionEn"
                  >
                    <a-input :disabled="disabled" v-model="v.instructionEn" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    label="图片视频"
                    prop="fileList"
                  >
                    <a-upload
                      name="listimg"
                      list-type="picture-card"
                      accept=".jpg,.png,.gif,.jpeg,.bmp,.mp4"
                      :disabled="disabled"
                      :show-upload-list="false"
                      :customRequest="handleUploadImg"
                      :fileList="v.fileList"
                      :before-upload="handleBeforeUpload"
                      @change="handleChange(i, $event)"
                    >
                      <img
                        style="width: 200px"
                        v-if="v.imageUrl"
                        :src="v.imageUrl"
                        alt="avatar"
                      />
                      <video
                        style="width: 200px"
                        v-else
                        :src="v.videoUrl"
                      ></video>
                      <div v-if="v.fileList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">
                          {{ $t("dicItem.upload") }}
                        </div>
                      </div>
                    </a-upload>
                    <div class="upload-hint">
                      图片： 建议尺寸800px*600px，不超过300K，支持.jpg .bmp
                      .jpeg .png .gif格式
                    </div>
                    <div class="upload-hint">
                      视频：
                      建议尺寸600px*450px，不超过500K，不超过15秒，支持.mp4格式
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
          <a-button
            block
            icon="push"
            v-if="netList.steps.length < 4"
            :disabled="disabled"
            @click="addWriter"
          >
            添加步骤
          </a-button>
          <a-alert
            message="配网文案上限为四条"
            v-if="netList.steps.length >= 4"
            banner
          />
        </div>
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
  </div>
</template>
<script>
import { getNetworkGuideList } from "@/api/product";
import { CommonLengthRules } from "@/utils/validate";
export default {
  props: {
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
      networkGuides: [],
      rules: {
        instruction: CommonLengthRules(1, 200, "请输入1-200的中文文案"),
        instructionEn: CommonLengthRules(1, 200, "请输入1-200的英文文案"),
        fileList: [
          {
            type: "array",
            required: true,
            message: "请上传图片或视频",
          },
        ],
      },
      visible: false,
      confirmLoading: false,
      writerForm: {
        instruction: "",
        instructionEn: "",
        imageUrl: "",
        videoUrl: "",
        fileList: [],
        sort: "",
      },
      fileList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      fileIndex: null, // 当前处理的是哪一文件
      netType: null, // 当前处理哪一种配网类型
      netList: { steps: [] }, // 当前处理的配网数据
      editNet: [], // 编辑时候回显数据
    };
  },
  created() {
    this.init();
  },
  watch: {
    formData: function (newData, oldData) {
      this.init();
    },
  },
  methods: {
    // 选择文案
    selectNetworkGuide(item, index) {
      this.netType = item.type;
      this.netList = item;
      // 文件回显
      this.netList.steps.sort((a,b)=>{return a.sort - b.sort})
      this.netList.steps.forEach((v) => {
        v.fileList = [
          {
            uid: "1",
            name: v.imageUrl || v.videoUrl, // 有图片显示图片
            status: "done",
            url: v.imageUrl || v.videoUrl, // 有视频显示视频
          },
        ];
      });
      this.visible = true;
    },

    init() {
      getNetworkGuideList().then((res) => {
        if (res.data) {
          res.data.forEach((v) => {
            v.bl = false;
          });
          this.networkGuides = res.data || [];
          // 编辑 需要特殊处理数据 设置过的不用默认数据
          if (this.formData && this.formData.id) {
            res.data.forEach((item, index) => {
              this.formData.networkGuides.forEach((v) => {
                if (v && v.type === item.type) {
                  this.networkGuides.splice(index, 1, { ...v, bl: true });
                }
              });
            });
          }
          
        }
      });
    },
    handleOk() {
      let submitBl = false;
      this.netList.steps.some((v, i) => {
        this.$refs["ruleForm"][i].validate((valid) => {
          submitBl = !valid;
        });
        return submitBl;
      });
      if (!submitBl) {
        this.networkGuides.forEach((v) => {
          if (this.netType == v.type) {
            v = this.netList;
          }
        });
        this.visible = false;
      } 
    },
    handleCancel() {
      this.visible = false;
    },
    // 文件上传
    async handleUploadImg({ file }) {
      this.confirmLoading = true;
      let res = await this.$UploadFile({ file, dir: "networkGuide" });
      if (res && res.code == 0) {
        if (this.isImg(file.type)) {
          this.netList.steps[this.fileIndex].imageUrl = res.data.fullPath;
          this.netList.steps[this.fileIndex].videoUrl = "";
        } else if (this.isVideo(file.type)) {
          this.netList.steps[this.fileIndex].videoUrl = res.data.fullPath;
          this.netList.steps[this.fileIndex].imageUrl = "";
        } else {
          this.netList.steps[this.fileIndex].fileList = [];
          this.$message.warning("文件格式有误");
        }
      } else {
        this.netList.steps[this.fileIndex].fileList = [];
        this.netList.steps[this.fileIndex].imageUrl = "";
        this.netList.steps[this.fileIndex].videoUrl = "";
        this.$message.error("上传失败");
      }
      this.confirmLoading = false;
    },
    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isType =
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/bmp" ||
          file.type === "image/gif" ||
          file.type === "image/jpeg" ||
          file.type === "video/mp4";
        if (!isType) {
          this.$message.warning(
            "请选择.jpg,.png,.bmp,.jpeg,.gif图片或者,mp4视频"
          );
          return reject(false);
        }
        if (this.isImg(file.type) && file.size / 1024 / 1024 > 0.3) {
          this.$message.warning("上传图片最大300k");
          return reject(false);
        }
        if (this.isVideo(file.type) && file.size / 1024 / 1024 > 0.5) {
          this.$message.warning("上传视频最大500k");
          return reject(false);
        }
        return resolve(true);
      });
    },
    handleChange(i, { fileList }) {
      this.fileIndex = i;
      this.netList.steps[this.fileIndex].fileList = fileList;
    },
    addWriter() {
      let form = JSON.parse(JSON.stringify(this.writerForm));
      if (this.netList.steps.length > 0) {
        this.$refs["ruleForm"][this.netList.steps.length - 1].validate(
          (valid) => {
            if (valid) {
              this.netList.steps.push({...form, sort: this.netList.steps.length+1});
            }
          }
        );
      } else {
        this.netList.steps.push({...form,sort: 1});
      }
    },
    deleteWriter(i) {
      this.$Delete(this, "").then((res) => {
        this.netList.steps.splice(i, 1)
        this.netList.steps.forEach((item,index)=>{
          item['sort'] = index+1
        })
      });
    },
    // 是否是图片/视频
    isImg(e) {
      return (
        e === "image/jpeg" ||
        e === "image/png" ||
        e === "image/gif" ||
        e === "image/jpg" ||
        e === "image/bmp"
      );
    },
    isVideo(e) {
      return e === "video/mp4";
    },
  },
};
</script>
<style lang="less" scoped>
.networkGuide-data {
  padding: 10px 0 10px 10px;
  .networkGuide-text {
    display: inline-block;
    width: 200px;
  }
}
.modal-content {
  height: 60vh;
  padding: 0 20px;
  overflow: auto;
}
.writer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.upload-hint {
  height: 14px;
  line-height: 14px;
  font-size: 12px;
}
</style>
