<template>
  <a-spin :spinning="loginLoading">
    <a-card style="width: 500px; height: 360px" :bordered="false">
      <div class="login-title">爱星物联账号登录</div>
      <a-form-model ref="formLogin" :model="form" :rules="rules">
        <a-form-model-item prop="username">
          <a-input
            size="large"
            type="text"
            name="username"
            :placeholder="$t('login.account')"
            v-model="form.username"
          >
            <a-icon
              slot="prefix"
              type="user"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input
            size="large"
            type="password"
            name="password"
            :placeholder="$t('login.password')"
            v-model="form.password"
            @keyup.enter="handleSubmit"
          >
            <a-icon
              slot="prefix"
              type="lock"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-row type="flex" justify="space-between">
            <a-col>
              <a-checkbox :checked="remember" @change="handleChange">
                {{ $t("login.rememberpassword") }}
              </a-checkbox>
            </a-col>
            <a-col>
              <a-button
                type="link"
                @click="$router.push('/user/reset-passwords')"
              >
                忘记密码?
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-item>
          <a-button
            block
            size="large"
            type="primary"
            class="login-button"
            :loading="loginLoading"
            :disabled="loginLoading"
            @click="handleSubmit"
          >
            {{ $t("login.submit") }}
          </a-button>
        </a-form-item>
      </a-form-model>
    </a-card>
  </a-spin>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { APP_REMEMBER_PASSWORD } from "@/store/mutation-types";
import { PassWordRules, CommonRules } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    return {
      form: {},
      rules: {
        username: CommonRules("请输入账号"),
        password: PassWordRules(),
      },
      loginLoading: false,
      remember: false,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["rememberPassword"]),
  },
  methods: {
    ...mapActions(["Login"]),
    init() {
      // 记住密码初始化
      this.remember = this.rememberPassword.remember;
      if (!this.remember) return;
      this.form = {
        username: this.rememberPassword.username,
        password: this.rememberPassword.password,
      };
    },
    handleChange(e) {
      this.remember = e.target.checked;
    },
    handleSubmit() {
      this.$refs["formLogin"].validate((valid) => {
        if (!valid) return;
        this.loginLoading = true;
        const md5 = require('md5')
        let loginParams = { ...this.form ,password : md5(this.form.password)};
        loginParams.verifyCode = "8888"; // 验证码
        loginParams.channel = "pc";
        loginParams.platformtype = "cloud";
        this.Login(loginParams)
          .then((res) => this.loginSuccess(res))
          .finally(() => {
            this.loginLoading = false;
          });
      });
    },
    loginSuccess(res) {
      this.toast(res);
      if (res.code === 0) {
        // 是否记住密码
        if (this.remember) {
          this.$store.commit(APP_REMEMBER_PASSWORD, {
            remember: true,
            username: this.form.username,
            password: this.form.password,
          });
        } else {
          this.$store.commit(APP_REMEMBER_PASSWORD, {
            remember: false,
            username: "",
            password: "",
          });
        }
        // 登录成功去首页
        this.$router.push({ path: "/aithings" });
      }
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
