<template>
  <div class="aithings-base-setting">
    <a-alert
      style="margin-bottom: 10px"
      message="用户名不能修改，手机号邮箱请确保在可用状态，个人头像大小不超过1M，png格式最佳。"
      banner
      closable
    />
    <a-row :gutter="16">
      <a-col :md="12" :lg="8">
        <a-form-model
          layout="vertical"
          ref="ruleForm"
          :model="user"
          :rules="rules"
        >
          <a-form-model-item :label="$t('system.username')">
            <a-input
              disabled
              v-model="user.username"
              :MaxLength="10"
              :placeholder="$t('system.username')"
            />
          </a-form-model-item>
          <a-form-model-item label="手机号码" prop="phonenum">
            <a-input
              v-model="user.phonenum"
              :MaxLength="6"
              placeholder="请输入手机号码"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('system.email')" prop="email">
            <a-input
              v-model="user.email"
              :MaxLength="30"
              :placeholder="$t('system.email')"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="handleSave">
              {{ $t("public.save") }}
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div
          class="ant-upload-preview"
          @click="$refs.imgCutterDialog.open(getUserAvatar)"
        >
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="user.avatar" :onerror="`javascript:this.src='${require('../../../../assets/image/avatar.jpg')}';`" />
        </div>
      </a-col>
    </a-row>
    <img-cutter-dialog
      ref="imgCutterDialog"
      mode="autoUpload"
      type="userphoto"
      :userId="user.id"
      @ok="setavatar"
    />
  </div>
</template>
<script>
import { updateUserInfo, getUserInfo } from "@/api/user";
import ImgCutterDialog from "@/components/ImgCutterDialog";
import { PhoneRules, EmailRules } from "@/utils/validate";
export default {
  components: {
    "img-cutter-dialog": ImgCutterDialog,
  },
  data() {
    return {
      user: {},
      rules: {
        phonenum: PhoneRules(),
        email: EmailRules(),
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    getUserAvatar(e) {
      this.user.avatar = e.dataURL;
    },
    init() {
      getUserInfo().then((res) => {
        if (res.code == 0) {
          this.user = {
            id: String(res.data.id),
            username: res.data.userName,
            phonenum: res.data.phonenumber,
            email: res.data.email,
            avatar: res.data.avatar,
          };
        }
      });
    },
    handleSave() {
      this.$refs["ruleForm"].validate((e) => {
        if (e) {
          updateUserInfo(this.user).then((res) => {
            this.toast(res);
            if (res.code == 0) {
              this.$store.dispatch("GetInfo");
            }
          });
        }
      });
    },
    setavatar(data) {
      this.user.avatar = data.dataURL;
    },
  },
};
</script>
<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 180px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 20px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
