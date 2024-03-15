<template>
  <div>
    <div class="table-operator">
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-alert message="请配置支持的上架临时皮肤" banner />
        </a-col>
        <a-col>
          <a-button type="primary" icon="plus" @click="handleNew">
            {{ $t("public.add") }}
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table size="small" rowKey="id" :data-source="dataSource" :columns="columns" :loading="loading" :pagination="false">
      <div slot="code" slot-scope="text, item">
        {{$DictName('skin_code',item.code)}}
      </div>
      <template slot="previewImages" slot-scope="text, item">
        <img :src="url" v-for="(url,index) in item.previewImages" :key="index" class="preview-image"/>
      </template>
      <template slot="action" slot-scope="text, item">
        <a-button type="link" size="small" icon="setting" @click="handleEdit(item)"> 修改 </a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" icon="delete" @click="handleDelete(item.id)"> 删除 </a-button>
      </template>
    </a-table>
    <a-modal :title="form.id ? '编辑上架皮肤主题':'添加上架皮肤主题'" :width="640" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称(中文)" prop="name">
            <a-input v-model="form.name" placeholder="请输入名称(中文)" />
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称(英文)" prop="nameEn">
            <a-input v-model="form.nameEn" placeholder="请输入名称(英文)" />
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="功能KEY" prop="code">
            <a-select style="width: 50%" placeholder="请选择功能KEY值" v-model="form.code" :options="$DictList('skin_code')"/>
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="预览图" prop="previewImages">
          <section class="upload-wrap">
            <div class="upload-item" v-for="(img,index) in form.previewImages" :key="index">
              <upload-img imgDir="module" :imgRequest="true" :propsImgSrc="img" imgHint="" @ok="$e=>handleUpload($e,index)"></upload-img>
              <a-icon v-if="img" type="minus-circle"  class="delete-icon" @click="deleteIcon(index)"/>
            </div>
          </section>
          至少上传3张，建议4-5张
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注说明" prop="remark">
            <input-textarea v-model="form.remark" placeholder="请输入备注说明"></input-textarea>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
      <template #footer>
        <a-button type="primary" @click="handleFinish"> 完成 </a-button>
        <a-divider type="vertical" />
        <a-button key="back" @click="handleCancel"> 关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { getSkinList,deleteSkin,getSkinDetail,addSkin,editSkin } from '@/api/oemApp'
import { CommonNameRules, CommonRules } from "@/utils/validate";
export default {
  props: {
    id: { type: String, default: '' },
  },
  data() {
    return {
      loading: false,
      dataSource: [],
      columns: [
        { dataIndex: "name", title: "皮肤名称" },
        { dataIndex: "code", title: "功能KEY", scopedSlots: { customRender: "code" } },
        { dataIndex: "previewImages", title: "预览图", scopedSlots: { customRender: "previewImages" } },
        { dataIndex: "remark", title: "备注说明", width: "20%" },
        { title: "操作", key: "action", align: "center", width: "180px", scopedSlots: { customRender: "action" } },
      ],
      visible: false,
      confirmLoading: false,
      form: {previewImages:['']},
      rules: {
        name: CommonNameRules("请输入名称(中文)"),
        nameEn: CommonNameRules("请输入名称(英文)"),
        code: CommonRules("请选择功能KEY", 'string'),
        previewImages: [{ required: true, validator: (rule, value, callback) => { value.length > 3 ?  callback() :callback(new Error("请上传3-5张预览图，至少3张"))}, trigger:'' }],
      },
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
    };
  },
  mounted(){
    if(!this.id) return
    this.getSkinList()
  },
  methods: {
    // 获取皮肤列表
    async getSkinList(){
      const res = await getSkinList({appTemplateId:this.id})
      if(res.code !== 0) return
      this.dataSource = res.data?.list?.map(item=>{
        return {
          ...item,
          previewImages: item.previewImages ? JSON.parse(item.previewImages) : []
        }
      }) || []
    },

    //新增
    handleNew() {
      this.form = {previewImages:['']}
      this.visible = true;
    },

    // 编辑
    handleEdit(item){
      this.form = {
        ...item,
        previewImages:item.previewImages.length < 5 ?[...item.previewImages,''] :[...item.previewImages]
      }
      this.visible = true;
    },

    // 新增/编辑完成
    handleFinish(){
      this.$refs["ruleForm"].validate(async(valid) => {
        if (!valid) return
        const param = {
          ...this.form,
          previewImages: JSON.stringify(this.form.previewImages.filter(item=>item!=='')),
          appTemplateId: this.id
        }
        const res =this.form.id ? await editSkin(param) : await addSkin(param)
        if(res.code !== 0 ) return
        this.visible = false;
        this.$refs["ruleForm"].resetFields()
        this.getSkinList()
      });
    },

    // 图片上传成功
    handleUpload(data,index){
      console.log(data,index)
      this.form.previewImages[index]=data.fullPath
      if(index == this.form.previewImages.length-1 && this.form.previewImages.length < 5){
        this.form.previewImages.push('')
      }
      if(this.form.previewImages.length > 3){
        this.$refs["ruleForm"].clearValidate(["previewImages"])
      }
      
    },

    // 删除图片
    deleteIcon(index){
      this.form.previewImages.splice(index, 1)
    },

    // 删除
    handleDelete(id){
      this.$confirm({
        title: "确定是否删除",
        content: "删除后，将不可恢复",
        onOk: async() => {
          const res = await deleteSkin(id)
          if(res.code !== 0) return
          this.getSkinList()
        },
      });
    },

    handleCancel() {
      this.visible = false;
      this.$refs["ruleForm"].resetFields()
    },


  },
};
</script>
<style lang="less" scoped>
  .preview-image{
    max-width: 48px;
    max-height: 48px;
  }
  .upload-wrap{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 510px;
    .upload-item{
      margin: 0 10px 10px 0;
      position: relative;
      .delete-icon{
        display: none;
      }
      &:hover{
        .delete-icon{
          display: block;
          position: absolute;
          top: -3px;
          right: -3px;
          cursor: pointer;
          color: crimson;
        }
      }
    }
    
  }
</style>
