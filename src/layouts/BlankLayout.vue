<template>
  <div>
    <route-view />
  </div>
</template>

<script>
import RouteView from "./RouteView.vue";
export default {
  name: "BlankLayout",
  components: {
    "route-view": RouteView,
  },
};
</script>

<style scoped></style>
