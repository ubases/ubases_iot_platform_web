import PreviewModal from "./index.vue";
export default function (Vue) {
  const Constructor = Vue.extend(PreviewModal);
  const Instance = new Constructor();
  Instance.$mount();
  document.body.appendChild(Instance.$el);
  Vue.prototype.$PreviewModal = ({ url = "", type = "" }) => {
    Instance.previewVisible = true;
    Instance.url = Array.isArray(url) ? url : [url] ;
    Instance.type = type;
  };
}
