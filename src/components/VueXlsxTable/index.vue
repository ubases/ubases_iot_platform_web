<template>
  <div class="vue-xlsx-container">
    <a-button type="primary" :disabled="disabled" @click="handleUploadBtnClick">
      <slot></slot>
    </a-button>
    <input
      :id="uploadInputId"
      type="file"
      :accept="accept"
      class="c-hide"
      @change="handkeFileChange"
    />
  </div>
</template>

<script>
import * as XLSX from "xlsx/xlsx.mjs";

export default {
  name: "VueXlsxTable",
  data() {
    return {
      rawFile: null,
      workbook: null,
      tableData: {
        header: [],
        body: [],
      },
      uploadInputId: new Date().getUTCMilliseconds(),
    };
  },
  props: {
    accept: {
      type: String,
      default: ".xlsx, .xls",
    },
    disabled: [Boolean],
  },
  computed: {
    rABS() {
      return window.xlsxEventBus.XLSX_EVENTS_DATA.options.rABS;
    },
  },
  methods: {
    handkeFileChange(e) {
      if (this.rawFile !== null) {
        return;
      }
      this.rawFile = e.target.files[0];
      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          let xlsxArr = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          this.workbook = workbook;
          this.initTable(this.xlsxArrToTableArr(xlsxArr));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    fileConvertToWorkbook(file) {
      let reader = new FileReader();
      let fixdata = (data) => {
        let o = "",
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      };
      return new Promise((resolve, reject) => {
        try {
          reader.onload = (renderEvent) => {
            let data = renderEvent.target.result;
            if (this.rABS) {
              /* if binary string, read with type 'binary' */
              resolve(XLSX.read(data, { type: "binary" }));
            } else {
              /* if array buffer, convert to base64 */
              let arr = fixdata(data);
              resolve(XLSX.read(btoa(arr), { type: "base64" }));
            }
          };
          reader.onerror = (error) => {
            reject(error);
          };
          if (this.rABS) {
            reader.readAsBinaryString(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    xlsxArrToTableArr(xlsxArr) {
      let tableArr = [];
      let length = 0;
      let maxLength = 0;
      let maxLengthIndex = 0;
      xlsxArr.forEach((item, index) => {
        length = Object.keys(item).length;
        if (maxLength < length) {
          maxLength = length;
          maxLengthIndex = index;
        }
      });
      let tableHeader = Object.keys(xlsxArr[maxLengthIndex]);
      let rowItem = {};
      xlsxArr.forEach((item) => {
        rowItem = {};
        for (let i = 0; i < maxLength; i++) {
          rowItem[tableHeader[i]] = item[tableHeader[i]] || "";
        }
        tableArr.push(rowItem);
      });
      return {
        header: tableHeader,
        data: tableArr,
      };
    },
    tableArrToXlsxArr({ data, header }) {
      let xlsxArr = [];
      let tempObj = {};
      data.forEach((rowItem) => {
        tempObj = {};
        rowItem.forEach((item, index) => {
          tempObj[header[index]] = item;
        });
        xlsxArr.push(tempObj);
      });
      return xlsxArr;
    },
    initTable({ data, header }) {
      this.tableData.header = header;
      this.tableData.body = data;
      this.$emit("on-select-file", this.tableData);
    },
    handleUploadBtnClick() {
      this.clearAllData();
      document.getElementById(this.uploadInputId).click();
    },
    clearAllData() {
      document.getElementById(this.uploadInputId).value = null;
      this.tableData = {
        header: [],
        body: [],
      };
      this.rawFile = null;
      this.workbook = null;
    },
  },
};
</script>

<style lang="less">
.vue-xlsx-container {
  display: inline-block;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .c-hide {
    display: none;
  }
}
</style>
