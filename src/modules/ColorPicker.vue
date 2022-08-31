<template>
  <div class="color-picker">
    <div class="surface-wrap transparent" name="target">
      <div
        :style="{
          background,
          height: '100%',
        }"
      ></div>
    </div>
    <tippy to="target" trigger="click" theme="light" interactive ref="tippy">
      <div class="tippy-wrap">
        <div class="tabs">
          <div
            :class="{ tab: true, active: tabIndex === 'single' }"
            @click="tabIndex = 'single'"
          >
            纯色
          </div>
          <div
            :class="{ tab: true, active: tabIndex === 'gradient' }"
            @click="tabIndex = 'gradient'"
          >
            渐变
          </div>
        </div>
        <SingleColorPicker
          v-bind="colorData"
          @change="handleChange"
          :opacityDisabled="opacityDisabled"
          v-show="tabIndex === 'single'"
        ></SingleColorPicker>
        <GradientColorPicker
          v-bind="colorData"
          @change="handleChange"
          :opacityDisabled="opacityDisabled"
          v-show="tabIndex === 'gradient'"
        ></GradientColorPicker>
      </div>
    </tippy>
  </div>
</template>

<script>
import SingleColorPicker from "./SingleColorPicker.vue";
import GradientColorPicker from "./GradientColorPicker.vue";
import { TippyComponent } from "vue-tippy";
import "tippy.js/themes/light.css";
import tinycolor from "tinycolor2";

export default {
  name: "ColorPicker",
  components: {
    SingleColorPicker,
    GradientColorPicker,
    Tippy: TippyComponent,
  },
  props: {
    color: {
      type: String,
      default: "rgba(255, 255, 255, 1)",
    },
    opacityDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabIndex: "single",
      colorData: {
        color: "#ffffff",
        opacity: 100,
        startColor: "#ffffff",
        startOpacity: 100,
        startLeft: 0,
        endColor: "#000000",
        endOpactity: 100,
        endLeft: 100,
      },
    };
  },
  computed: {
    background() {
      return this.tabIndex === "single"
        ? tinycolor(this.colorData.color)
            .setAlpha(this.colorData.opacity / 100)
            .toRgbString()
        : `linear-gradient(${this.colorData.degree}deg, ${tinycolor(
            this.colorData.startColor
          )
            .setAlpha(this.colorData.startOpacity / 100)
            .toRgbString()} ${this.colorData.startLeft}%, ${tinycolor(
            this.colorData.endColor
          )
            .setAlpha(this.colorData.endOpacity / 100)
            .toRgbString()} ${this.colorData.endLeft}%)`;
    },
  },
  watch: {
    color() {
      this.formatColor();
    },
    tabIndex() {
      this.$emit("change", this.background);
    },
  },
  methods: {
    handleChange(colorData) {
      this.colorData = {
        ...this.colorData,
        ...colorData,
      };
      this.$emit("change", this.background);
    },
    formatColor() {
      try {
        if (/^(\s*linear-gradient)/.test(this.color)) {
          const color = this.color.slice(16, -1);
          const colors = color
            .match(
              /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*\d(\.\d+)?)?\s*\)/g
            )
            .map((color) => tinycolor(color));
          const positions = color
            .match(/\d{1,3}%/g)
            .map((i) => +i.slice(0, -1));
          const degree = color.match(/^\d*/)[0] % 360;
          this.colorData = {
            ...this.colorData,
            degree,
            startColor: colors[0].toHexString(),
            startOpacity: colors[0].getAlpha() * 100,
            startLeft: positions[0],
            endColor: colors[1].toHexString(),
            endOpacity: colors[1].getAlpha() * 100,
            endLeft: positions[1],
          };
          this.tabIndex = "gradient";
        } else {
          const color = tinycolor(this.color);
          this.colorData = {
            ...this.colorData,
            color: color.toHexString(),
            opacity: color.getAlpha() * 100,
          };
          this.tabIndex = "single";
        }
      } catch (e) {
        console.error("请输入正确的颜色:", e);
      }
    },
  },
  mounted() {
    this.formatColor();
  },
};
</script>

<style lang="less" scoped>
.color-picker {
  cursor: pointer;
  .surface-wrap {
    width: 100px;
    height: 25px;
    box-shadow: 0 0 5px 0 #ccc;
  }
}
.tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  background-color: #f7f7f7;
  border-radius: 4px;
  padding: 3px;
  .tab {
    flex: 1;
    padding: 5px 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .active {
    background-color: #fff;
    font-weight: bold;
  }
}
.tippy-wrap {
  width: 243px;
  padding: 11px 7px 16px;
  box-sizing: content-box;
  background-color: #fff;
}
</style>
