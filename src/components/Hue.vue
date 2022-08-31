<template>
  <div class="hue">
    <div class="hue-container" ref="container" @mousedown="handleMouseDown">
      <div
        class="hue-pointer"
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
import { handleDragEvent } from "../utils/Dom";
export default {
  name: "HueComponent",
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (h) => h >= 0 && h <= 360,
    },
  },
  data() {
    return {
      pointerPosition: 0,
      currentHue: this.hue,
    };
  },
  watch: {
    hue(h) {
      this.currentHue = h;
    },
    currentHue() {
      this.updatePosition();
    },
  },
  methods: {
    getBarLeftPosition() {
      const container = this.$refs.container;
      const pointer = this.$refs.pointer;
      const rect = container.getBoundingClientRect();
      if (this.currentHue === 360) {
        return rect.width - pointer.offsetWidth / 2;
      }
      return (
        ((this.currentHue % 360) * (rect.width - pointer.offsetWidth)) / 360 +
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
      left = Math.min(left, rect.width - pointer.offsetWidth / 2);
      left = Math.max(pointer.offsetWidth / 2, left);

      this.currentHue = Math.round(
        ((left - pointer.offsetWidth / 2) /
          (rect.width - pointer.offsetWidth)) *
          360
      );

      this.$emit("hChange", this.currentHue);
      this.$emit("change", this.currentHue);
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
.hue {
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
    background-image: -webkit-linear-gradient(
      left,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 16.66%,
      rgb(0, 255, 0) 33.33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 66.66%,
      rgb(255, 0, 255) 83.33%,
      rgb(255, 0, 0) 100%
    );
    background-size: 100%;
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
