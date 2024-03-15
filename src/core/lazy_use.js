import Vue from "vue";

// base library
import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Form,
  FormModel,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  PageHeader,
  Result,
  Statistic,
  Descriptions,
  Space,
  message,
  notification,
  TreeSelect,
  Tree,
  Collapse,
  Cascader
} from "ant-design-vue";
import Viser from "viser-vue";

import VueCropper from "vue-cropper";

import ProLayout, { PageHeaderWrapper } from "@ant-design-vue/pro-layout";

// 预览框
import PreviewModal from "@/components/PreviewModal/index";

// 文本域封装
import InputTextarea from "@/components/InputTextarea/index";

// 阿里字体图标组件封装
import IconFont from "@/components/IconFont";

// 图片上传组件封装
import UploadImg from "@/components/UploadImg";

// 文件上传组件封装
import UploadFile from "@/components/UploadFile";

// 图片加载组件封装
import Image from "@/components/Image";

// ext library
import Dialog from "@/components/Dialog";
import MultiTab from "@/components/MultiTab";
import "./directives/action";

// excel文件转json
import vueXlsxTable from "@/components/VueXlsxTable/index.js";
Vue.use(vueXlsxTable, { rABS: false });

Vue.use(ConfigProvider);
Vue.use(Layout);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormModel);
Vue.use(Row);
Vue.use(Col);
Vue.use(Modal);
Vue.use(Table);
Vue.use(Tabs);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(Popover);
Vue.use(Dropdown);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Breadcrumb);
Vue.use(Steps);
Vue.use(Spin);
Vue.use(Menu);
Vue.use(Drawer);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Tag);
Vue.use(Divider);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Skeleton);
Vue.use(Popconfirm);
Vue.use(PageHeader);
Vue.use(Result);
Vue.use(Statistic);
Vue.use(Descriptions);
Vue.use(Space);
Vue.use(TreeSelect);
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(Cascader);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;

Vue.use(Viser);
Vue.use(Dialog); // this.$dialog func
Vue.use(MultiTab);
Vue.use(VueCropper);
Vue.use(PreviewModal);
Vue.component("input-textarea", InputTextarea);

Vue.component("pro-layout", ProLayout);
Vue.component("page-container", PageHeaderWrapper);
Vue.component("page-header-wrapper", PageHeaderWrapper);
Vue.component("icon-font", IconFont);
Vue.component("upload-img", UploadImg);
Vue.component("upload-file", UploadFile);
Vue.component("a-image", Image);
