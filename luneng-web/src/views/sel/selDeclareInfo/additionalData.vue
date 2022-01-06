<template>
  <div class="app-container">
    <dec-project-com topBoxType="按钮" :currInfoId="currId">
      <el-button
        slot="item0"
        style="width: 70px"
        type="primary"
        >保 存
      </el-button>
      <el-button
        slot="item1"
        style="width: 70px"
        type="primary"
        >提 交
      </el-button>
      <el-button
        slot="item2"
        style="width: 70px"
        >取 消
      </el-button>
    </dec-project-com>
  </div>
</template>

<script>
  import DecProjectCom from '@/views/components/DecProjectCom'
  export default {
    name: '',
    data () {
      return {
        currId: null
      }
    },
    created() {
      if(this.$route.query.id) {
        this.currId = this.$route.query.id * 1
      }
    },
    components: {
      DecProjectCom
    }
  }
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 50px 50px 50px;
}
</style>
