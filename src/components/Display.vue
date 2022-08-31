<template>
  <div class="display">
    <div class="color transparent">
      <div class="color-cube" :style="{ background: cubeColor }"></div>
    </div>
    <div class="color-input">
      <input :value="currentColorHex" @blur="onColorBlur" />
    </div>
    <div class="alpha-input" v-if="!opacityDisabled">
      <input :value="currentAlpha + '%'" @blur="onAlphaBlur" />
    </div>
  </div>
</template>

<script>
import tinycolor from "tinycolor2";

export default {
  name: "DisplayComponent",
  props: {
    color: {
      type: String,
      default: "#ffffff",
    },
    alpha: {
      type: Number,
      default: 100,
    },
    opacityDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentColor: this.color,
      currentAlpha: this.alpha,
    };
  },
  computed: {
    cubeColor() {
      return tinycolor(this.currentColor)
        .setAlpha(this.currentAlpha / 100)
        .toRgbString();
    },
    currentColorHex() {
      return tinycolor(this.currentColor)
        .setAlpha((100 - this.currentAlpha) / 100)
        .toHexString()
        .toUpperCase();
    },
  },
  watch: {
    color(c) {
      this.currentColor = c;
    },
    alpha(a) {
      this.currentAlpha = a;
    },
  },
  methods: {
    onColorBlur(e) {
      const target = e.target;
      const tc = tinycolor(target.value);
      if (tc.isValid()) {
        this.currentColor = tc.toHexString().toUpperCase();
        this.$emit("cChange", this.currentColor);
      }
    },
    onAlphaBlur(e) {
      const target = e.target;
      const alpha = parseInt(target.value.replace("%", ""));
      if (!isNaN(alpha)) {
        this.currentAlpha = alpha;
        this.$emit("aChange", this.currentAlpha);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.display {
  height: 28px;
  display: flex;
  align-items: center;

  .color {
    width: 50px;
    height: 100%;
    margin-right: 10px;
    box-shadow: 0px 0 5px #eee;

    &-cube {
      height: 100%;
    }
  }

  .color-input {
    height: 100%;
    flex: 1;
  }
  .alpha-input {
    height: 100%;
    width: 56px;
    margin-left: 8px;
  }

  input {
    padding: 0;
    border: 0;
    outline: none;
    color: #33383e;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
    background-color: #f1f2f4;
    border-radius: 4px;
    height: 100%;
    width: 100%;
  }
}
</style>
