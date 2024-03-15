const transitionStyle = "0.2s height ease-in-out";
const Transition = {
  //这些钩子是vue中transiton标签的一些钩子方法
  beforeEnter(el) {
    el.style.transition = transitionStyle;
    if (!el.dataset) el.dataset = {};

    el.style.height = 0;
  },

  enter(el) {
    if (el.scrollHeight !== 0) {
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = "";
    }
    el.style.overflow = "hidden";
  },

  afterEnter(el) {
    el.style.transition = "";
    el.style.height = "";
  },

  beforeLeave(el) {
    if (!el.dataset) el.dataset = {};
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  },

  leave(el) {
    if (el.scrollHeight !== 0) {
      el.style.transition = transitionStyle;
      el.style.height = 0;
    }
  },

  afterLeave(el) {
    el.style.transition = "";
    el.style.height = "";
  },
};

export default {
  name: "CollapseTransition",
  functional: true, //表示此组件是一个纯函数组件，只能使用props 自身内部没有状态
  render(
    h,
    {
      //render的第一个参数是h函数，用来创建虚拟dom，第二个参数是context对象，组件所需要的一切都经过这个对象来传递
      children,
    }
  ) {
    const data = {
      on: Transition,
    };
    return h("transition", data, children); //第一个参数标签名，第二个参数是属性，第三个参数是vnode节点
  },
};
