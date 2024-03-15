<template>
  <div class="aithings-role">
    <a-row :gutter="16">
      <a-col :span="24">
        <left-table @clickRow="clickRow" ref="leftTable"></left-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import LeftTable from "./components/LeftTable.vue";
import RightTable from "./components/RightTable.vue";
export default {
  name: "Role",
  components: {
    "left-table": LeftTable,
    "right-table": RightTable,
  },
  data() {
    return {
      roleInfo: {},
    };
  },
  activated () {
    this.$refs.leftTable.queryList()
  },
  methods: {
    clickRow(e) {
      this.roleInfo = e;
    },
  },
};
</script>
<style lang="less" scoped></style>
