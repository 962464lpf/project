<template>
  <div class="pro-fund">
    <div v-if="recruitContractInfoList.length > 0">
      <voucher-list
        v-for="(item, index) in recruitContractInfoList"
        :key="index"
        :contract-id="(item.id * 1)"
        @refreshbs="refreshHeight"
      />
    </div>
    <div v-if="recruitContractInfoList.length === 0">
      <span style="font-size: 16px; color:#666;">您还没有添加合同，暂无经费信息</span>
    </div>
  </div>
</template>

<script>
import voucherList from '@/views/proManagement/proImplement/fundManagement/childCom/voucherList'
import {getContractInfo} from "@/api/pro/proRecruit";
export default {
  name: "ProFund",
  props: {
    infoId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      recruitContractInfoList: []
    }
  },
  created() {
    this.getContractInfoDetail(this.infoId)
  },
  watch: {
    infoId(newVal) {
      this.getContractInfoDetail(newVal)
    }
  },
  components: {
    voucherList
  },
  methods: {
    //获取招采合同信息
    getContractInfoDetail(id) {
      getContractInfo(id).then(({data}) => {
        this.recruitContractInfoList = data
        this.$emit('refreshbs')
      })
    },
    refreshHeight() {
      this.$emit('refreshbs')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
