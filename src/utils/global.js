import { downloadTemplate, uploadFile } from "@/api/common";
import storage from "store";
import { deepClone } from '@/utils/util';

export default {
  install(Vue, options) {
    Vue.prototype.$Delete = function (that, msg) {
      return new Promise((resolve, reject) => {
        var title = that.$t("public.ready_delete") + msg + "?";
        that.$confirm({
          title: title,
          okText: that.$t("public.ok"),
          okType: "danger",
          cancelText: that.$t("public.cancel"),
          onOk: () => {
            resolve();
          },
          onCancel() {},
        });
      });
    };

    Vue.prototype.$Update = function (that, msg) {
      return new Promise((resolve, reject) => {
        var title = that.$t("public.ready_update") + msg + "?";
        that.$confirm({
          title: title,
          okText: that.$t("public.ok"),
          okType: "danger",
          cancelText: that.$t("public.cancel"),
          onOk: () => {
            resolve();
          },
          onCancel() {},
        });
      });
    };

    Vue.prototype.$Add = function (that, msg) {
      return new Promise((resolve, reject) => {
        var title = that.$t("public.ready_Add") + msg + "?";
        that.$confirm({
          title: title,
          okText: that.$t("public.ok"),
          okType: "danger",
          cancelText: that.$t("public.cancel"),
          onOk: () => {
            resolve();
          },
          onCancel() {},
        });
      });
    };

    Vue.prototype.$UpdateStatus = function (that, msg) {
      return new Promise((resolve, reject) => {
        var title = msg;
        that.$confirm({
          title: title,
          okText: that.$t("public.ok"),
          okType: "danger",
          cancelText: that.$t("public.cancel"),
          onOk: () => {
            resolve();
          },
          onCancel() {},
        });
      });
    };

    Vue.prototype.$DownloadTemplate = function (
      that,
      params,
      downloadfilename
    ) {
      return new Promise((resolve, reject) => {
        downloadTemplate(params)
          .then((res) => {
            if (res.type == "application/json") {
              // this.confirmLoading = false;
              const blob = new Blob([res]);
              var reader = new FileReader();
              reader.onload = function (event) {
                var content = reader.result; // 内容就在这里、
                var resObj = JSON.parse(content);
                that.$message.error(resObj.msg);
              };
              reader.readAsText(blob);
            } else {
              const blob = new Blob([res]);
              const downloadElement = document.createElement("a");
              const href = window.URL.createObjectURL(blob);
              downloadElement.href = href;
              downloadElement.download = downloadfilename; // xxx.xls/xxx.xlsx
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement);
              window.URL.revokeObjectURL(href);
            }
            resolve();
          })
          .catch((err) => {
            that.$message.error("服务器连接错误！");
            reject();
          });
      });
    };

    Vue.prototype.$DownloadFile = function (fileSrc, fileName = "") {
      // 下载文件的操作
      getBolb(fileSrc).then((blob) => {
        saveAs(blob, fileName);
      });
      function getBolb(url) {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "blob";
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            }
          };
          xhr.send();
        });
      }
      function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement("a");
          const body = document.querySelector("body");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          // fix Firefox
          link.style.display = "none";
          body.appendChild(link);
          link.click();
          body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        }
      }
    };

    /**
     * 获取字典类型list
     * @param {*} type 字典类型
     * @returns
     */
    Vue.prototype.$DictList = function (type) {
      let dictList = storage.get("app_dict_list") || [];
      let filterList = dictList.filter((dict) => {
        return dict.dictType == type;
      });
      return filterList.map((dict) => {
        return { key: dict.dictValue, label: dict.dictLabel ,value:dict.dictValue, listimg:dict.listimg};
      });
    };

    /**
     * 获取字典名称
     * @param {*} type 字典类型
     * @param {*} value 字典值
     * @returns
     */
    Vue.prototype.$DictName = function (type, value) {
      let dictList = storage.get("app_dict_list") || [];
      let list = dictList.filter((dict) => {
        return dict.dictType == type;
      });
      for (let i = 0; i < list.length; i++) {
        if (list[i].dictValue == value) {
          return list[i].dictLabel || "";
        }
      }
    };

    /**
     * 上传文件
     * @param {*} file 文件
     * @param {*} type 类型 1 单文件 2 多文件 3 base64
     * @param {*} source 来源 3 七牛
     * @param {*} dir 表标识
     * @returns
     */
    Vue.prototype.$UploadFile = function ({
      file,
      type = "1",
      source = "3",
      dir,
    }) {
      return new Promise((reject, resolve) => {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("source", source);
        formData.append("dir", dir);
        uploadFile(formData)
          .then((res) => {
            reject(res);
          })
          .catch((err) => {
            reject({
              code: -1,
              data: err,
            });
          });
      });
    };

    /**
     * 对象深拷贝
     */
    Vue.prototype.$deepClone = deepClone
  },
};
