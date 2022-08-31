<template>
  <div class="angle">
    <div
      class="angle-picker"
      ref="angle"
      @mousedown="handleMouseDown"
      :style="style"
    ></div>
  </div>
</template>

<script>
import { handleDragEvent } from "../utils/Dom";

const calcAngle = (element, event) => {
  const rect = element.getBoundingClientRect();

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  //获得中心点和鼠标坐标连线，与y轴正半轴之间的夹角
  const x = Math.abs(originX - event.clientX);
  const y = Math.abs(originY - event.clientY);
  const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const cos = y / z;
  const rad = Math.acos(cos); //用反三角函数求弧度
  let angle = Math.floor(180 / (Math.PI / rad)); //将弧度转换成角度

  if (event.clientX > originX && event.clientY > originY) {
    //鼠标在第四象限
    angle = 180 - angle;
  }

  if (event.clientX == originX && event.clientY > originY) {
    //鼠标在y轴负方向上
    angle = 180;
  }

  if (event.clientX > originX && event.clientY == originY) {
    //鼠标在x轴正方向上
    angle = 90;
  }

  if (event.clientX < originX && event.clientY > originY) {
    //鼠标在第三象限
    angle = 180 + angle;
  }

  if (event.clientX < originX && event.clientY == originY) {
    //鼠标在x轴负方向
    angle = 270;
  }

  if (event.clientX < originX && event.clientY < originY) {
    //鼠标在第二象限
    angle = 360 - angle;
  }

  return angle;
};
export default {
  name: "AngleComponent",
  props: {
    angle: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 40,
      validator: (v) => v >= 16,
    },
    borderWidth: {
      type: Number,
      default: 1,
      validator: (v) => v >= 1,
    },
    borderColor: {
      type: String,
      default: "#666",
    },
  },
  data() {
    return {
      rotate: this.angle,
    };
  },
  computed: {
    style() {
      return {
        width: this.size + "px",
        height: this.size + "px",
        borderWidth: this.borderWidth + "px",
        borderColor: this.borderColor,
        transform: `rotate(${this.rotate}deg)`,
      };
    },
  },
  watch: {
    angle(v) {
      this.rotate = v;
    },
  },
  methods: {
    handleDrag(e) {
      this.rotate = calcAngle(this.$refs.angle, e) % 360;
      if (!isNaN(Number(this.rotate))) {
        this.rotate =
          this.rotate > 360 || this.rotate < 0 ? this.angle : this.rotate;
        this.rotate = this.value === 360 ? 0 : this.rotate;
        this.$emit("change", this.rotate);
      }
    },
    handleMouseDown(e) {
      handleDragEvent(e, this.handleDrag);
    },
  },
};
</script>

<style lang="less" scoped>
.angle {
  transform: rotate(90deg);

  &-picker {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin: 4px;
    width: 16px;
    height: 16px;
    border: 1px solid #666;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;

    &::before {
      content: "";
      position: absolute;
      display: inline-block;
      vertical-align: middle;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 50%;
      height: 1px;
      background-color: #666;
    }
  }
}
</style>
