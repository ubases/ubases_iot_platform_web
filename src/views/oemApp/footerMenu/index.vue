<template>
  <a-card :bordered="false">
    <!-- 表格操作栏 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleNew('add')">
        {{ $t("public.add") }}
      </a-button>
    </div>
    <!-- 表格 -->
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="false">
      <template slot="name" slot-scope="text, record">
        <div class="link-a" @click="handleNew('details', record)">
          {{ record.name }}
        </div>
      </template>
      <template slot="defImage" slot-scope="text, record">
        <a-image :src="record.defImage" />
      </template>
      <template slot="selImage" slot-scope="text, record">
        <a-image :src="record.selImage" />
      </template>
      <template slot="action" slot-scope="text, record">
        <a-button type="link" size="small" icon="edit" @click="handleNew('edit', record)">
          {{ $t("public.edit") }}
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { getFooterMenuList } from "@/api/oemApp";
export default {
  name: "AppFooterMenu",
  data() {
    return {
      dataSource: [],
      columns: [
        { title: "序号", width: "80px", customRender: (text, record, index) => index + 1 },
        { dataIndex: "name", title: "菜单名称", scopedSlots: { customRender: "name" } },
        { dataIndex: "defImage", title: "默认图标", scopedSlots: { customRender: "defImage" } },
        { dataIndex: "selImage", title: "选中图标", scopedSlots: { customRender: "selImage" } },
        { dataIndex: "position", title: "排序" },
        { title: this.$t("public.action"), key: "action", align: "center", width: "180px", scopedSlots: { customRender: "action" } },
      ],
      loading: false,
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    query() {},
    reset() {},
    queryList() {
      this.loading = true;
      getFooterMenuList()
        .then((res) => {
          if (res.code === 0) {
            this.dataSource = res.data.list;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleNew(type, data = {}) {
      this.$routerPush({
        path: "/oem-app/footer-menu/details",
        query: { type, data: JSON.stringify(data) },
        name: "FooterMenuDetails",
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
