<template>
  <div class="aithings-update-pwd">
    <a-row :gutter="16">
      <a-col :md="12" :lg="8">
        <a-form-model
          layout="vertical"
          ref="ruleForm"
          :model="user"
          :rules="rules"
        >
          <a-form-model-item label="旧密码" prop="oldPassword">
            <a-input
              type="password"
              v-model="user.oldPassword"
              :MaxLength="10"
              placeholder="请输入旧密码"
            />
          </a-form-model-item>
          <a-form-model-item label="新密码" prop="newPassword">
            <a-input
              type="password"
              v-model="user.newPassword"
              :MaxLength="10"
              placeholder="请输入新密码"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="handleSubmit">确认修改</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { updatePwd } from "@/api/user";
import { mapGetters } from "vuex";
import { PassWordRules } from "@/utils/validate";
export default {
  data() {
    return {
      user: {
        oldPassword: "",
        newPassword: "",
      },
      rules: {
        oldPassword: PassWordRules("请输入旧密码"),
        newPassword: PassWordRules("请输入新密码"),
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    handleSubmit() {
      this.$refs["ruleForm"].validate((e) => {
        if (e) {
          const md5 = require('md5')
          const oldPassword = md5(this.user.oldPassword)
          const newPassword = md5(this.user.newPassword)
          updatePwd({oldPassword,newPassword}).then((res) => {
            if (res.code == 20001) {
              this.toast({ msg: "原密码验证错误" });
              return;
            }
            if (res.code == 0) {
              this.user = {
                oldPassword: "",
                newPassword: "",
              };
            }
            this.toast(res);
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.aithings-update-pwd {
}
</style>
