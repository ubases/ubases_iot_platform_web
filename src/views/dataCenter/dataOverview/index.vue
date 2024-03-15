<template>
  <a-card :bordered="false">
    <chart></chart>
  </a-card>
</template>
<script>
import chart from "./components/chart.vue";
export default {
  name: "DataOverview",
  components: {
    chart,
  },
  data() {
    return {
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>

</style>
