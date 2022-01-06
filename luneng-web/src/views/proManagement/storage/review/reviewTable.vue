<template>
  <table class="detail-table">
    <tr v-if="reviewList.length === 0">
      <td style="background-color: transparent;text-align: center;height: 150px;color: #999;">暂未设置专家组</td>
    </tr>
    <tr v-for="item in reviewList">
      <td :class="page == 'result' && item.result == '1' ? 'red-background' : ''">{{item.name}}</td>
      <td :class="page == 'result' && item.result == '1' ? 'red-background' : ''">{{item.remark}}</td>
    </tr>
  </table>
</template>

<script>
import {getReviewDetail} from "@/api/storage/review";

export default {
  props: {
    id: {
      default: null
    },
    page: {
      default: 'review'
    }
  },
  data() {
    return {
      reviewList: []
    };
  },
  created() {
    this.getReviewDetail();
  },
  methods: {
    getReviewDetail() {
      if(!this.id) return;
      getReviewDetail(this.id).then(res => {
        this.reviewList = res.data;
      })
    }
  },
  watch: {
    id (newVal) {
      this.getReviewDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
  .red-background {
    background: #fbe6e8!important;
  }
</style>
