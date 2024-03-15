import Vue from "vue";
import moment from "moment";

Vue.filter("momentFilter", function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return dataStr ? moment(dataStr * 1000).format(pattern) : dataStr;
});
