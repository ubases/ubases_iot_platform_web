<template>
  <a-card style="width: 500px" :bordered="false">
    <div class="login-title">重置密码</div>
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item prop="account">
          <a-input
            size="large"
            placeholder="手机号或邮箱"
            v-model="form.account"
          >
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="verificationCode">
          <a-input-group size="large">
            <a-row :gutter="8">
              <a-col :span="16">
                <a-input placeholder="验证码" v-model="form.verificationCode" />
              </a-col>
              <a-col :span="8">
                <a-button
                  style="width: 100%"
                  size="large"
                  :disabled="sendBoolean"
                  @click="onSend"
                >
                  {{ sendBoolean ? sendTime + "S后重新发送" : "发送验证码" }}
                </a-button>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item prop="newPwd">
          <a-input-password
            size="large"
            placeholder="新密码"
            v-model="form.newPwd"
          />
        </a-form-model-item>
        <a-form-model-item prop="confirmPwd">
          <a-input-password
            size="large"
            placeholder="确认新密码"
            v-model="form.confirmPwd"
          />
        </a-form-model-item>
        <a-form-model-item>
          <a-space direction="vertical" size="middle" style="width: 100%">
            <a-button block size="large" type="primary" @click="onSubmit">
              确认
            </a-button>
            <a-button block size="large" @click="$router.back()">
              取消
            </a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>
<script>
import { resetPassword, getVerificationCodeForExists } from "@/api/login";
import {
  PassWordRules,
  AccountRules,
  CommonLengthRules,
} from "@/utils/validate";
import { APP_REMEMBER_PASSWORD } from "@/store/mutation-types";
import { mapGetters } from "vuex";
var Timer;
export default {
  name: "ResetPasswords",
  data() {
    return {
      form: {},
      confirmLoading: false,
      rules: {
        account: AccountRules("请输入手机号或者邮箱"),
        verificationCode: CommonLengthRules(
          6,
          6,
          "请输入长度为六位的验证码",
          true
        ),
        newPwd: [
          ...PassWordRules("请输入新密码"),
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.confirmPwd && this.form.confirmPwd !== value) {
                callback("密码不一致");
                return;
              }
              callback();
            },
          },
        ],
        confirmPwd: [
          ...PassWordRules("请输入确认密码"),
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.newPwd && this.form.newPwd !== value) {
                callback("密码不一致");
                return;
              }
              callback();
            },
          },
        ],
      },
      sendBoolean: false,
      sendTime: 60,
    };
  },
  computed: {
    ...mapGetters(["rememberPassword"]),
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        const md5 = require('md5')
        const confirmPwd = md5(this.form.confirmPwd)
        const newPwd = md5(this.form.newPwd)
        this.form.password = newPwd
        resetPassword({...this.form,confirmPwd,newPwd}).then((res) => {
          if (res.code === 0) {
            this.toast(res);
            this.$router.back();
            this.$store.commit(APP_REMEMBER_PASSWORD, {
              remember: this.rememberPassword.remember,
              username: this.rememberPassword.username,
              password: this.form.password,
            });
          }
        });
      });
    },
    onSend() {
      this.$refs["ruleForm"].validateField("account", (err) => {
        if (err) return;
        getVerificationCodeForExists({ userName: this.form.account, type: 2 }).then(
          (res) => {
            this.toast(res);
            if (res.code === 0) {
              this.sendTime = 60;
              this.sendBoolean = true;
              Timer = setInterval(() => {
                if (this.sendTime-- <= 0) {
                  this.sendTime = 60;
                  this.sendBoolean = false;
                  Timer && clearInterval(Timer);
                }
              }, 1000);
            }
          }
        );
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login-title {
  font-weight: bold;
  font-size: 28px;
  color: @app-theme-color;
  margin-bottom: 25px;
  text-align: center;
}
</style>
