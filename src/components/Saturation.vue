<template>
  <div class="saturation">
    <div
      class="container"
      ref="container"
      :style="{ backgroundColor: background }"
      @mousedown="handleMouseDown"
    >
      <div class="white"></div>
      <div class="black"></div>
      <div
        class="pointer"
        :style="{
          top: pointerPosition.top + 'px',
          left: pointerPosition.left + 'px',
        }"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleDragEvent } from "@/utils/dom.js";
const clamp = (value, min, max) => {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
};

export default {
  name: "SaturationComponent",
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (v) => v >= 0 && v <= 360,
    },
    saturation: {
      type: Number,
      default: 0,
      validator: (v) => v >= 0 && v <= 100,
    },
    value: {
      type: Number,
      default: 100,
      validator: (v) => v >= 0 && v <= 100,
    },
  },
  data() {
    return {
      background: `hsl(${this.hue}, 100%, 50%)`,
      currentHsv: {
        h: this.hue,
        s: this.saturation,
        v: this.value,
      },
      pointerPosition: {
        top: 0,
        left: 0,
      },
    };
  },
  watch: {
    hue(h) {
      this.currentHsv.h = h;
      this.background = `hsl(${Math.round(this.currentHsv.h)}, 100%, 50%)`;
    },
    saturation(s) {
      this.currentHsv.s = s;
      this.updatePosition();
    },
    value(v) {
      this.currentHsv.v = v;
      this.updatePosition();
    },
  },
  methods: {
    updatePosition() {
      const container = this.$refs.container;
      if (container) {
        this.pointerPosition.left =
          (this.currentHsv.s / 100) * container.clientWidth;
        this.pointerPosition.top =
          (1 - this.currentHsv.v / 100) * container.clientHeight;
      }
    },
    handleDrag(e) {
      const container = this.$refs.container;
      if (container) {
        const rect = container.getBoundingClientRect();
        let left = e.clientX - rect.left;
        let top = e.clientY - rect.top;
        left = clamp(left, 0, rect.width);
        top = clamp(top, 0, rect.height);
        const s = Math.round((left / rect.width) * 100);
        const v = Math.round(clamp(-(top / rect.height) + 1, 0, 1) * 100);
        this.pointerPosition.left = left;
        this.pointerPosition.top = top;
        this.currentHsv.s = s;
        this.currentHsv.v = v;

        this.$emit("sChange", s);
        this.$emit("vChange", v);
        this.$emit("change", { s, v });
      }
    },
    handleMouseDown(e) {
      handleDragEvent(e, this.handleDrag);
    },
  },
  mounted() {
    this.updatePosition();
  },
};
</script>

<style lang="less" scoped>
.saturation {
  position: relative;
  margin-bottom: 10px;
  width: 243px;
  height: 132px;
  border-radius: 4px;
  .container {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
    .white,
    .black {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 4px;
    }
    .black {
      background: linear-gradient(0deg, #000, transparent);
    }
    .white {
      background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
    }
    .pointer {
      position: absolute;

      div {
        transform: translate(-5px, -5px);
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
        width: 10px;
        height: 10px;
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
</style>
