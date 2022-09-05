<template>
  <div class="wrap">
    <color-picker
      class="color-picker"
      :color="gradientColor"
      :type="type"
      @change="handleChange"
    ></color-picker>
  </div>
</template>

<script>
import ColorPicker from "./modules/ColorPicker.vue";
export default {
  components: { ColorPicker },
  data() {
    return {
      type: "single",
      singleColor: "#3fa219",
      gradientColor:
        "linear-gradient(90deg, rgb(235, 65, 101) 10%, rgb(142, 36, 170) 98%)",
    };
  },
  methods: {
    handleChange(v) {
      console.log("v: ", v);
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  height: 100%;
  .color-picker {
    margin: 0 auto;
  }
}
</style>