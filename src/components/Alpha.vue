<template>
  <div class="alpha transparent">
    <div
      class="alpha-container"
      ref="container"
      @mousedown="handleMouseDown"
      :style="{ background: gradientColor }"
    >
      <div
        class="alpha-pointer"
        ref="pointer"
        :style="{
          left: pointerPosition + 'px',
        }"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import tinycolor from "tinycolor2";
import { handleDragEvent } from "@/utils/dom.js";

export default {
  name: "HueComponent",
  props: {
    alpha: {
      type: Number,
      default: 0,
      validator: (a) => a >= 0 && a <= 100,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
  },
  data() {
    return {
      pointerPosition: 0,
      currentAlpha: this.alpha,
    };
  },
  computed: {
    gradientColor() {
      const rgb = tinycolor(this.color).setAlpha(1).toRgbString();
      const alphaGgb = tinycolor(this.color).setAlpha(0).toRgbString();
      const deg = "right";
      return `linear-gradient(to ${deg}, ${alphaGgb}, ${rgb}`;
    },
  },
  watch: {
    alpha(a) {
      this.currentAlpha = a;
    },
    currentAlpha() {
      this.updatePosition();
    },
  },
  methods: {
    getBarLeftPosition() {
      const container = this.$refs.container;
      const pointer = this.$refs.pointer;
      const alpha = this.currentAlpha;
      const rect = container.getBoundingClientRect();

      return Math.round(
        (alpha / 100) * (rect.width - pointer.offsetWidth) +
          pointer.offsetWidth / 2
      );
    },
    updatePosition() {
      this.pointerPosition = this.getBarLeftPosition();
    },
    handleDrag(e) {
      const container = this.$refs.container;
      const pointer = this.$refs.pointer;
      const rect = container.getBoundingClientRect();

      let left = e.clientX - rect.left;
      left = Math.max(pointer.offsetWidth / 2, left);
      left = Math.min(left, rect.width - pointer.offsetWidth / 2);

      this.currentAlpha = Math.round(
        ((left - pointer.offsetWidth / 2) /
          (rect.width - pointer.offsetWidth)) *
          100
      );

      this.$emit("aChange", this.currentAlpha);
      this.$emit("change", this.currentAlpha);
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
.alpha {
  position: relative;
  margin-bottom: 10px;
  width: 100%;
  height: 14px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
  cursor: pointer;

  &-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  &-pointer {
    position: absolute;
    width: 14px;
    height: 14px;
    div {
      width: 14px;
      height: 14px;
      border-radius: 6px;
      transform: translate(-7px, 0);
      background-color: #f8f8f8;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
    }
  }
}
</style>
