<template>
  <div class="app-container">
    <dec-project-com
      topBoxType="标题"
      :showScoreInfo="true"
      :currInfoId="infoId"
      :currExpertId="currExpertId">
    </dec-project-com>
  </div>
</template>

<script>
  import DecProjectCom from '@/views/components/DecProjectCom'

  export default {
    name: '',
    data() {
      return {
        //当前申报项目id
        infoId: null,
        //当前申报项目专家id
        currExpertId: null
      }
    },
    created() {
      if(this.$route.query.infoId) {
        this.infoId = this.$route.query.infoId * 1
      }
      if(this.$route.query.expertId) {
        this.currExpertId = this.$route.query.expertId * 1
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
    padding: 40px;
  }
</style>
