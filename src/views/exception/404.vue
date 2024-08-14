<template>
  <!-- <a-result status="404" title="404" sub-title="抱歉！您访问的页面不存在。">
    <template #extra>
      <a-button type="primary" @click="toHome"> 返回登录页 </a-button>
    </template>
  </a-result> -->
</template>

<script>

export default {
  name: "Exception404",
  beforeCreate() {
    this.$store.dispatch("Logout", false).then(() => {
      this.$router.push({ name: "login" });
    });
  },
  methods: {
    // toHome() {
    //   this.$store.dispatch("Logout", false).then(() => {
    //     this.$router.push({ name: "login" });
    //   });
    // },
  },
};
</script>
