<template>
  <div class="gradient-color-picker">
    <div class="gradient-controller">
      <div class="gradient-range" ref="range">
        <div class="gradient-range-container transparent">
          <div
            class="gradient-range-container-bkg"
            :style="{ background: bkgColor }"
          ></div>
          <div class="gradient-range-container-content">
            <div
              :class="{
                slider: true,
                'slider-active': isStartActive,
              }"
              ref="start"
              :style="{ left: `calc(${colorData.startLeft}% - 8px)` }"
              @mousedown="handleStartMouseDown"
            ></div>
            <div
              :class="{
                slider: true,
                'slider-active': !isStartActive,
              }"
              ref="end"
              :style="{ left: `calc(${colorData.endLeft}% - 8px)` }"
              @mousedown="handleEndMouseDown"
            ></div>
          </div>
        </div>
      </div>
      <div class="gradient-degree">
        <div class="gradient-degree-input" name="degree" ref="degree">
          <input
            :value="colorData.degree + '°'"
            @blur="(e) => handleAngleBlur(e.target.value)"
          />
        </div>
        <tippy
          to="degree"
          theme="light"
          interactive
          placement="bottom"
          :appendTo="() => this.$refs.degree"
          trigger="click"
          @clickOutside.stop
        >
          <angle :angle="colorData.degree" @change="handleAngleChange"></angle>
        </tippy>
      </div>
    </div>
    <single-color-picker
      :color="getColor"
      :opacity="getOpacity"
      @change="handleChange"
      :opacityDisabled="opacityDisabled"
    ></single-color-picker>
  </div>
</template>

<script>
import { TippyComponent } from "vue-tippy";
import "tippy.js/themes/light.css";
import Angle from "../components/Angle.vue";
import SingleColorPicker from "./SingleColorPicker.vue";

import tinycolor from "tinycolor2";
import { handleDragEvent } from "../utils/Dom";

export default {
  name: "GradientColorPicker",
  components: {
    Tippy: TippyComponent,
    Angle,
    SingleColorPicker,
  },
  props: {
    degree: {
      type: Number,
      default: 90,
      validator: (value) => value >= 0 && value <= 360,
    },
    startColor: {
      type: String,
      default: "#ffffff",
    },
    startOpacity: {
      type: Number,
      default: 100,
      validator: (value) => value >= 0 && value <= 100,
    },
    startLeft: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100,
    },
    endColor: {
      type: String,
      default: "#000000",
    },
    endOpacity: {
      type: Number,
      default: 100,
      validator: (value) => value >= 0 && value <= 100,
    },
    endLeft: {
      type: Number,
      default: 100,
      validator: (value) => value >= 0 && value <= 100,
    },
    opacityDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isStartActive: true,
      colorData: {},
    };
  },
  computed: {
    bkgColor() {
      const startColor = tinycolor(this.colorData.startColor)
        .setAlpha(this.colorData.startOpacity / 100)
        .toRgbString();
      const endColor = tinycolor(this.colorData.endColor)
        .setAlpha(this.colorData.endOpacity / 100)
        .toRgbString();
      return `linear-gradient(${this.colorData.degree}deg, ${startColor} ${this.colorData.startLeft}%, ${endColor} ${this.colorData.endLeft}%)`;
    },
    getColor() {
      return this.isStartActive
        ? this.colorData.startColor
        : this.colorData.endColor;
    },
    getOpacity() {
      return this.isStartActive
        ? this.colorData.startOpacity
        : this.colorData.endOpacity;
    },
  },
  watch: {
    colorData: {
      deep: true,
      handler(v) {
        this.$emit("change", v);
      },
    },
  },
  methods: {
    handleAngleBlur(angle) {
      const res = parseInt(angle.replace("°", ""));
      if (!isNaN(res)) {
        this.colorData.degree = res % 360;
      }
    },
    handleAngleChange(angle) {
      this.colorData.degree = angle;
    },
    handleStartDrag(e) {
      this.isStartActive = true;
      const range = this.$refs.range;
      const start = this.$refs.start;
      const rect = range.getBoundingClientRect();
      let left = e.clientX - rect.left;
      left = Math.max(start.offsetWidth / 2, left);
      left = Math.min(left, rect.width - start.offsetWidth / 2);
      this.colorData.startLeft = Math.round(
        ((left - start.offsetWidth / 2) / (rect.width - start.offsetWidth)) *
          100
      );
    },
    handleEndDrag(e) {
      this.isStartActive = false;
      const range = this.$refs.range;
      const end = this.$refs.end;
      const rect = range.getBoundingClientRect();
      let left = e.clientX - rect.left;
      left = Math.max(end.offsetWidth / 2, left);
      left = Math.min(left, rect.width - end.offsetWidth / 2);
      this.colorData.endLeft = Math.round(
        ((left - end.offsetWidth / 2) / (rect.width - end.offsetWidth)) * 100
      );
    },
    handleStartMouseDown(e) {
      handleDragEvent(e, this.handleStartDrag);
    },
    handleEndMouseDown(e) {
      handleDragEvent(e, this.handleEndDrag);
    },
    handleChange({ color, opacity }) {
      if (color !== undefined) {
        if (this.isStartActive) {
          if (color === "transparent") {
            this.colorData.startOpacity = 0;
          } else {
            this.colorData.startColor = color;
          }
        } else {
          if (color === "transparent") {
            this.colorData.endOpacity = 0;
          } else {
            this.colorData.endColor = color;
          }
        }
      }
      if (opacity !== undefined) {
        if (this.isStartActive) {
          this.colorData.startOpacity = opacity;
        } else {
          this.colorData.endOpacity = opacity;
        }
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.colorData = {
        degree: this.degree,
        startColor: this.startColor,
        startOpacity: this.startOpacity,
        startLeft: this.startLeft,
        endColor: this.endColor,
        endOpacity: this.endOpacity,
        endLeft: this.endLeft,
      };
    }, 0);
  },
};
</script>

<style lang="less" scoped>
.gradient-color-picker {
  width: 243px;
  .gradient-controller {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .gradient-range {
      flex: 1;
      &-container {
        position: relative;
        height: 16px;
        border-radius: 5px;
        &-bkg {
          height: 100%;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
        }
        &-content {
          position: absolute;
          width: calc(100% - 14px);
          top: 0;
          height: 100%;
          left: 7px;
          .slider {
            position: absolute;
            top: -2px;
            width: 14px;
            height: 16px;
            overflow: hidden;
            border: 2px solid #fff;
            border-radius: 2px;
            cursor: pointer;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.35);
            box-sizing: content-box;
          }
          .slider-active {
            position: relative;
            z-index: 1;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2), 0 0 0 1.2px #2254f4;
          }
        }
      }
    }
    .gradient-degree {
      width: 64px;
      height: 28px;
      margin-left: 8px;
      &-input {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f6f7f9;
        border-radius: 4px;
        input {
          max-width: 28px;
          text-align: center;
          border: none;
          outline: none;
          background-color: initial;
          color: #33383e;
          font-size: inherit;
          overflow: visible;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
