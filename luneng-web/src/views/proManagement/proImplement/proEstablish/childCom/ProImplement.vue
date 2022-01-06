<template>
  <div class="pro-implement">
    <plan-play-result
      @refreshbs="refreshHeight"
      :tab-active-name="tabActiveName"
      :pro-detail-flag="proDetailFlag"
      :info-id="infoId"/>
  </div>
</template>

<script>
import planPlayResult from '@/views/proManagement/proImplement/proImplementation/childCom/planPlayResult'

export default {
  name: "ProImplement",
  props: {
    infoId: {
      type: Number,
      default: null
    },
    tabActiveName: {
      type: String,
      default: ''
    },
    proDetailFlag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  components: {
    planPlayResult
  },
  methods: {
    //刷新高度
    refreshHeight() {
      this.$emit('refreshbs')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
