<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "BScroll",
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    scrollXTem: {
      type: Boolean,
      default: false
    },
    scrollYTem: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      click:true,
      probeType: this.probeType,
      pullUpload: this.pullUpload,
      mouseWheel: true,
      scrollX: this.scrollXTem,
      scrollY: this.scrollYTem
    })

    this.scroll.on('scroll', (position) => {
      this.$emit('bscroll', position)
    })

    // this.scroll.on('pullingUp', () => {
    //   // console.log("上拉加载更多");
    //   this.$emit('pullingUp')
    // })
  },
  methods: {
    scrollTo(x, y ,time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
