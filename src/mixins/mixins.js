export default {
  data() {
    return {
      aColFlex: {
        xxl: 4,
        xl: 6,
        lg: 8,
        md: 12,
        sm: 24,
      },
    };
  },
  computed: {},
  mounted() {},
  watch: {},
  methods: {
    $routerPush({ path = "", name = "", query = {}, keepAlive = true }) {
      if (keepAlive) {
        this.$store.commit("delRouterKeepAlive", name);
      }
      this.$nextTick(() => {
        this.$router.push({ path, query });
      });
    },
  },
};
