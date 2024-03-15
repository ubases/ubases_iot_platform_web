<template>
  <a-card :bordered="false">
    <a-page-header :title="type == 'add'?'创建新版本':'编辑版本'" @back="$multiTab.closeCurrentPage()">
      <div style="width: 500px; margin: 0 auto">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
      </div>
      <div style="height: 20px"></div>
      <basic-message ref="basicMsg" :type="type" :id="id" @next="handleNextStep" v-show="current === 0"/>
      <putaway-skin ref="skin" :id="id" v-show="current === 1" />
      <div style="width: 500px; text-align: center; margin: 20px auto">
        <a-button type="primary" @click="nextStep" v-if="current === 0">
          保存
        </a-button>
        <a-divider type="vertical" v-if="current === 0" />
        <a-button type="primary" @click="current = 0" v-if="current === 1">
          上一步
        </a-button>
        <a-divider type="vertical" v-if="current === 1" />
        <a-button @click="handleCancel"> 取消 </a-button>
      </div>
    </a-page-header>
  </a-card>
</template>
<script>
import basicMessage from "../components/basicMessage.vue";
import putawaySkin from "../components/putawaySkin.vue";

export default {
  name: "TemplateManageDetails",
  components: {
    "basic-message": basicMessage,
    "putaway-skin": putawaySkin,
  },
  data() {
    return {
      current: 0,
      type:'',
      id: "",
      steps: [
        { title: "基础信息" },
        { title: "上架皮肤" },
      ],
      basicData: {}
    };
  },
  created(){
    this.type = this.$route.query.type || ''
    this.id = this.$route.query.id || ''
  },
  methods: {


    // 点击下一步
    nextStep(){
      this.$refs["basicMsg"].formValid()
    },

    // 跳转下一步
    handleNextStep(id){
      this.current = 1
      this.id = id
    },

    handleCancel(){
      this.$multiTab.closeCurrentPage()
    }
  },
};
</script>
<style lang="less" scoped></style>
