<template>
  <a-card :bordered="false">
    <a-page-header :title="title" @back="$multiTab.closeCurrentPage()">
      <a-spin :spinning="loading">
        <a-card title="信息" :bordered="false">
          <a-form-model ref="ruleForm" :model="form">
            <!-- 企业名称 企业性质 -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="企业名称">
                  {{ auditDetails.companyName }}
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="企业性质" prop="name">
                  {{ $DictName("company_nature", auditDetails.nature) }}
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 营业执照号码 营业执照 -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="营业执照号码">
                  {{ auditDetails.licenseNo }}
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="身份证号">
                  {{ auditDetails.idcard }}
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 法人姓名 申请人姓名 -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="法人姓名">
                  {{ auditDetails.legalPerson }}
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="申请人姓名">
                  {{ auditDetails.applyPerson }}
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 身份证号 身份证照片 -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="营业执照">
                  <a-image width="100px" height="70px" :src="auditDetails.license"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="身份证照片">
                  <a-space>
                    <a-image width="100px" height="70px" :src="auditDetails.idcardFrontImg"/>
                    <a-image width="100px" height="70px" :src="auditDetails.idcardAfterImg"/>
                  </a-space>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 联系电话 联系地址 -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="联系电话">
                  {{ auditDetails.phone }}
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item :label-col="two.labelCol" :wrapper-col="two.wrapperCol" label="联系地址">
                  {{ auditDetails.address }}
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-card>
        <a-card title="操作记录" :bordered="false">
          <a-table
            size="small"
            rowKey="opterTime"
            :data-source="dataSource"
            :columns="columns"
            :pagination="false"
          >
            <template slot="opterTime" slot-scope="text, record">
              <span>{{ record.opterTime | momentFilter }}</span>
            </template>
          </a-table>
        </a-card>
        <a-card :bordered="false">
          <a-button type="primary" v-if="auditDetails.status === 2" @click="showModal(1)">
            通过
          </a-button>
          <a-divider type="vertical" v-if="auditDetails.status === 2" />
          <a-button type="primary" v-if="auditDetails.status === 2" @click="showModal(2)">
            不通过
          </a-button>
          <a-divider type="vertical" v-if="auditDetails.status === 2" />
          <a-button type="primary" v-if="auditDetails.status === 3" @click="showModal(3)">
            撤销
          </a-button>
          <a-divider type="vertical" v-if="auditDetails.status === 3" />
          <a-button style="margin-left: 10px" @click="$multiTab.closeCurrentPage()">
            返回
          </a-button>
        </a-card>
      </a-spin>
      <form-modal ref="formModal" @ok="init"></form-modal>
    </a-page-header>
  </a-card>
</template>
<script>
import { getCompanyAuthDetails } from "@/api/authority";
import FormModal from "../components/FormModal.vue";
export default {
  name: "DeveloperAuditDetails",
  components: {
    "form-modal": FormModal,
  },
  data() {
    return {
      id: "",
      title: "认证详情",
      labelCol: { xs: { span: 24 }, sm: { span: 3 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 21 }},
      two: {
        labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
        wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
      },
      form: {
        why: "",
      },
      loading: false,
      dataSource: [],
      columns: [
        { dataIndex: "result", title: "审核结果", },
        { dataIndex: "opter", title: "操作人" },
        { dataIndex: "opterTime", title: "操作时间", scopedSlots: { customRender: "opterTime" } },
        { dataIndex: "why", title: "理由", width: "700px", ellipsis: true },
      ],
      visible: false,
      confirmLoading: false,
      auditDetails: {},
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      getCompanyAuthDetails({ id: this.id }).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.authList;
          this.auditDetails = res.data;
        }
        this.loading = false;
      });
    },
    showModal(status) {
      let title = "";
      if (status === 1) {
        title = "通过申请";
      } else if (status === 2) {
        title = "拒绝申请";
      } else if (status === 3) {
        title = "撤销申请";
      }
      this.$refs["formModal"].init(this.id, status, title);
    },
  },
};
</script>
<style lang="less" scoped></style>
