<template>
  <a-modal title="问题详情" :width="800" :visible="visible" :confirm-loading="loading" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="ruleForm" :model="form">
        <a-form-model-item label="" prop="lang">
          <a-select style="width: 200px" v-model="form.lang" placeholder="请选择语种" @change="onChangeLang">
            <a-select-option :value="v.code" v-for="v in langTypeList" :key="v.code">
              {{ v.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="" prop="lang">
          <h2 style="padding: 0 15px; margin: 0">{{ form.title }}</h2>
        </a-form-model-item>
        <a-form-model-item label="" prop="lang">
          <div class="ql-container ql-editor" v-html="form.content"></div>
        </a-form-model-item>
      </a-form-model>
      <a-result title="什么也没有!" v-if="!form.content && !form.title">
        <template #icon>
          <a-icon type="smile" theme="twoTone" />
        </template>
      </a-result>
    </a-spin>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk" :loading="loading">
        确定
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { getDocEntryDetails } from "@/api/oemApp";
export default {
  data() {
    return {
      loading: false,
      visible: false,
      form: {},
      queryParam: {
        setingId: "",
        lang: "",
      },
    };
  },
  computed: {
    ...mapGetters(["langTypeList"]),
  },
  methods: {
    init(setingId, lang) {
      this.visible = true;
      this.queryParam.setingId = setingId;
      this.queryParam.lang = lang;
      this.getLangDetails();
    },
    onChangeLang(e) {
      this.queryParam.lang = e;
      this.getLangDetails();
    },
    getLangDetails() {
      this.loading = true;
      getDocEntryDetails(this.queryParam)
        .then((res) => {
          if (res.code !== 0) return;
          this.form = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleOk() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
