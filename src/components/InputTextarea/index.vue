<template>
  <div class="InputTextarea">
    <a-input
      :disabled="disabled"
      v-model="content"
      :maxLength="maxLength"
      :placeholder="placeholder"
      :rows="rows"
      type="textarea"
    />
    <div class="textarea-hint">{{ content.length }}/{{ maxLength }}</div>
  </div>
</template>
<script>
export default {
  name: "InputTextarea",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Number],
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    maxLength: {
      type: Number,
      default: 500,
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      content: "",
    };
  },
  watch: {
    content(newVal) {
      this.$emit("input", newVal);
    },
    value(newVal) {
      this.content = newVal;
    },
   
  },
  mounted() {
    this.content = this.value;
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.InputTextarea {
  position: relative;
  .textarea-hint {
    position: absolute;
    right: 10px;
    bottom: 10px;
    height: 12px;
    line-height: 12px;
  }
}
</style>
