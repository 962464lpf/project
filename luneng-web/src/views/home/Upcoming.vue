<template>
  <div class="upcoming">
    <div class="text">待办事项</div>
    <el-table
      ref="table"
      height="250"
      v-loading="loading"
      :data="uncompleted">
      <el-table-column
        label="序号"
        min-width="55"
        align="center"
        type="index">
      </el-table-column>
      <el-table-column
        min-width="200"
        label="事项类型"
        align="center"
        prop="optionType">
      </el-table-column>
      <el-table-column
        min-width="260"
        label="事项名称"
        align="center"
        prop="optionName">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleMatter(scope.row)"
          >{{scope.row.optionName}}
          </el-button>
        </template>
      </el-table-column>
      </el-table>
  </div>
</template>

<script>
import {undoneMatter} from "@/api/admin/info";

export default {
  name: "Upcoming",
  data() {
    return {
      loading: false,
      uncompleted: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    //获取待办事项
    getList() {
      this.loading = true
      undoneMatter().then(({data}) => {
        this.uncompleted = data
        this.loading = false
      })
    },
    handleMatter(row) {
      this.$router.push({
        path: row.path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upcoming {
  width: 100%;
  height: 380px;
  padding: 15px 10px;
  background-color: #fff;
  margin-top: 20px;
  box-shadow: 5px 5px 5px 0 #eaeaea;
  .text {
    width: 100%;
    color: #000;
    font-size: 18px;
    line-height: 18px;
    font-weight: bold;
    border-bottom: 2px solid #eaeaea;
    padding: 10px 0;
    margin-bottom: 10px;
  }
}
</style>
