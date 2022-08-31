<template>
  <div class="single-color-picker">
    <div class="header" v-show="isAdvanceMode">
      <span style="cursor: pointer" @click="onBack">
        <div class="back"></div>
        <span>返回</span>
      </span>
    </div>
    <compact v-if="!isAdvanceMode" @cChange="handleCompactChange"></compact>
    <saturation
      v-else
      :hue="getHue"
      :saturation="getSaturation"
      :value="getValue"
      @change="handleSaturationChange"
    ></saturation>
    <hue :hue="getHue" @change="handleHueChange"></hue>
    <alpha
      :color="currentColor"
      :alpha="currentOpacity"
      @change="updateOpacity"
      v-if="!opacityDisabled"
    ></alpha>
    <display
      :color="currentColor"
      :alpha="currentOpacity"
      @cChange="updateColor"
      @aChange="updateOpacity"
      :opacityDisabled="opacityDisabled"
    ></display>
  </div>
</template>

<script>
import tinycolor from "tinycolor2";

import Compact from "../components/Compact.vue";
import Saturation from "../components/Saturation.vue";
import Hue from "../components/Hue.vue";
import Alpha from "../components/Alpha.vue";
import Display from "../components/Display.vue";

export default {
  name: "SingleColorPicker",
  components: {
    Compact,
    Saturation,
    Hue,
    Alpha,
    Display,
  },
  props: {
    color: {
      type: String,
      default: "#ffffff",
    },
    opacity: {
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
      isAdvanceMode: false,
      currentColor: this.color,
      currentOpacity: this.opacityDisabled
        ? tinycolor(this.color).getAlpha() * 100
        : this.opacity !== 100
        ? this.opacity
        : tinycolor(this.color).getAlpha() * 100,
    };
  },
  computed: {
    getHue() {
      return tinycolor(this.currentColor).toHsv().h;
    },
    getSaturation() {
      return tinycolor(this.currentColor).toHsv().s * 100;
    },
    getValue() {
      return tinycolor(this.currentColor).toHsv().v * 100;
    },
  },

  watch: {
    currentColor(color) {
      this.$emit("change", {
        color,
      });
    },
    currentOpacity(opacity) {
      this.$emit("change", {
        opacity,
      });
    },
    color(c) {
      this.currentColor = c;
    },
    opacity(o) {
      this.currentOpacity = o;
    },
  },
  methods: {
    onBack() {
      this.isAdvanceMode = false;
    },
    updateColor(c) {
      this.currentColor = c;
    },
    updateOpacity(o) {
      this.currentOpacity = o;
    },
    handleCompactChange(c) {
      if (c === "advance") {
        this.isAdvanceMode = c === "advance";
      } else if (c === "transparent") {
        this.updateOpacity(0);
      } else {
        this.updateColor(c);
      }
    },
    handleSaturationChange({ s, v }) {
      this.updateColor(
        tinycolor({
          h: this.getHue,
          s,
          v,
        }).toHexString()
      );
    },
    handleHueChange(h) {
      this.updateColor(
        tinycolor({
          h,
          s: this.getSaturation || 1,
          v: this.getValue || 1,
        }).toHexString()
      );
    },
  },
};
</script>

<style lang="less" scoped>
.single-color-picker {
  width: 243px;
  .header {
    height: 20px;
    margin-bottom: 10px;
    text-align: left;
    .back {
      border: solid black;
      border-width: 0 1px 1px 0;
      display: inline-block;
      padding: 4px;
      margin-left: 2px;
      transform: rotate(135deg);
    }
  }
}
</style>
