<template>
  <div>
    <div class="data-overview-title">累计实时概览</div>
    <a-row type="flex" justify="space-between" align="bottom" :gutter="20">
      <a-col :xxl="6" :xl="12" :lg="12" :md="24" :sm="24" v-for="v in accumulateList" :key="v.type" @click="selectAccumulate(v.type)">
        <div :class="['data-overview-tab',accumulateType === v.type && 'data-overview-tab-select',]">
          <img :src="require(`../../../../assets/image/${v.type}.png`)" />
          <div class="data">
            <div class="hint">{{ v.name }}</div>
            <div class="number">{{ v.total }}</div>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="data-overview-canvas">
      <div id="c1"></div>
    </div>
    <div class="data-overview-title">今日实时预览</div>
    <a-row type="flex" justify="space-between" align="bottom" :gutter="20">
      <a-col :xxl="6" :xl="12" :lg="12" :md="24" :sm="24" v-for="v in todayList" :key="v.type" @click="selectToday(v.type)">
        <div
          :class="[ 'data-overview-tab', todayType === v.type && 'data-overview-tab-select']"
        >
          <img :src="require(`../../../../assets/image/${v.type}.png`)" />
          <div class="data">
            <div class="hint">{{ v.name }}</div>
            <div class="number">{{ v.total }}</div>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="data-overview-canvas">
      <div id="c2"></div>
    </div>
  </div>
</template>
<script>
import { getOverviewToday, getOverviewAccumulate} from "@/api/data";
import AMapLoader from "@amap/amap-jsapi-loader";
const MAP_KEY = "cc29345335a2a140608bdcc4b6c34bb4";

import { mapGetters } from "vuex";
// echart
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent, TooltipComponent} from "echarts/components";
import { BarChart, ScatterChart, EffectScatterChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  ScatterChart,
  EffectScatterChart,
  UniversalTransition,
]);
export default {
  data() {
    return {
      map: null,
      accumulateList: [
        { type: "activeDevice", name: "累计设备激活", total: 0},
        { type: "developer", name: "累计开放平台用户数", total: 0 },
        { type: "appUser", name: "累计APP用户数量", total: 0 },
        { type: "deviceFault", name: "累计设备故障", total: 0 },
      ],
      todayList: [
        { type: "activeDevice", name: "今日设备激活", total: 0 },
        { type: "developer", name: "今日开放平台用户数", total: 0 },
        { type: "appUser", name: "今日APP用户数量", total: 0 },
        { type: "deviceFault", name: "今日设备故障", total: 0 },
      ],
      accumulateData: {
        activeDevice: {},
        appUser: {},
        developer: {},
        deviceFault: {},
      },
      todayData: {
        activeDevice: {},
        appUser: {},
        developer: {},
        deviceFault: {},
      },
      accumulateType: "",
      todayType: "",
      chartToday: null,
      chartAccumulative: null,
      infoWindow: null,
    };
  },
  mounted() {
    // 今日
    getOverviewToday().then((res) => {
      if (res.code === 0) {
        this.todayData = res.data;
        this.todayList.forEach((v) => {
          v.total = this.todayData[v.type].total;
        });
        this.selectToday("activeDevice");
      }
    });
    // 累计
    getOverviewAccumulate().then((res) => {
      if (res.code === 0) {
        this.accumulateData = res.data;
        this.accumulateList.forEach((v) => {
          v.total = this.accumulateData[v.type].total;
        });
        this.selectAccumulate("activeDevice");
      }
    });

    window.addEventListener("resize", this.handleResize);
  },
  computed: {
    ...mapGetters(["color"]),
  },
  methods: {
    handleResize() {
      this.chartToday && this.chartToday.resize();
      this.chartAccumulative && this.chartAccumulative.resize();
    },
    accumulative() {
      let nameData = this.accumulateData[this.accumulateType].data.map((v) => {
        return v.time;
      });
      let valueData = this.accumulateData[this.accumulateType].data.map((v) => {
        return v.total;
      });
      var option = this.setCanvasOption(nameData, valueData);
      if (this.chartAccumulative) {
        this.chartAccumulative.setOption(option);
        return;
      }
      var chartDom = document.getElementById("c1");
      this.chartAccumulative = echarts.init(chartDom);
      this.chartAccumulative.setOption(option);
    },
    today() {
      let nameData = this.todayData[this.todayType].data.map((v) => {
        return v.time;
      });
      let valueData = this.todayData[this.todayType].data.map((v) => {
        return v.total;
      });
      var option = this.setCanvasOption(nameData, valueData);
      if (this.chartToday) {
        this.chartToday.setOption(option);
        return;
      }
      var chartDom = document.getElementById("c2");
      this.chartToday = echarts.init(chartDom);
      this.chartToday.setOption(option);
    },
    setCanvasOption(nameData, valueData) {
      return {
        grid: {
          top: 20,
          left: 70,
          right: 70,
          width: "auto",
          height: "auto",
        },
        xAxis: {
          type: "category",
          data: nameData,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        color: [this.color],
        series: [
          {
            data: valueData,
            type: "bar",
            barCategoryGap: "45%",
            barMaxWidth: "60",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(24,144,255,1)" },
                { offset: 0.5, color: "rgba(24,144,255,0.5)" },
                { offset: 1, color: "rgba(24,144,255,0)" },
              ]),
            },
          },
        ],
      };
    },

    selectAccumulate(type) {
      this.accumulateType = type;
      this.accumulative();
    },
    selectToday(type) {
      this.todayType = type;
      this.today();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
<style lang="less" scoped>
.data-overview-title {
  padding: 20px 0;
  font-size: 18px;
  font-weight: 900;
  color: #343a40;
}
.data-overview-tab {
  display: flex;
  height: 100px;
  padding: 26px 20px;
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dae6f8;
  cursor: pointer;
  .data {
    padding: 0 15px;
    .hint {
      font-size: 14px;
      font-weight: 400;
      color: #343a40;
    }
    .number {
      font-size: 20px;
      font-weight: 500;
      color: @app-theme-color;
    }
  }
  img {
    width: 48px;
    height: 48px;
  }
}
.data-overview-tab-select {
  box-shadow: 0px 2px 4px 1px rgba(127, 160, 210, 0.4);
  border: 1px solid @app-theme-color;
}
.data-overview-canvas {
  padding: 30px 0;
  #c1 {
    width: 100%;
    height: 500px;
  }
  #c2 {
    width: 100%;
    height: 500px;
  }
  #c3 {
    width: 90%;
    height: 1000px;
    margin: 0 auto;
  }
}

/deep/ .markey-tooltip {
  padding: 2px 8px;
  border-radius: 2px;
  background-color: #fff;
}
</style>
