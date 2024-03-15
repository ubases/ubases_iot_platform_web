<script>
import { mapGetters } from "vuex";
export default {
  name: "RouteView",
  props: {
    keepalive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["includeRouterView"]),
  },
  render() {
    const {
      $route: { meta },
      $store: { getters },
    } = this;
    const inKeep = (
      <keep-alive include={this.includeRouterView}>
        <router-view />
      </keep-alive>
    );

    return inKeep;
  },
};
</script>
