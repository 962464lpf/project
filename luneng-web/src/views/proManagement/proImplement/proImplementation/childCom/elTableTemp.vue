<template>
  <div class="el-table-temp">
    <el-table ref="table" :data="proImplementPlanListTem">
      <el-table-column
        label="序号"
        width="60"
        align="center"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParamsTem.pageNum - 1) * queryParamsTem.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column width="230" prop="projectName" label="项目名称">
        <template slot-scope="scope">
          <div class="project-name" @click="navProDetail(scope.row)">
            <span>{{ scope.row.projectName ? scope.row.projectName : '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="proBeginDate" label="开始时间">
        <template slot-scope="scope">
          <div class="project-name" @click="navPlanResultList(scope.row)">
            <span>{{ scope.row.proBeginDate ? scope.row.proBeginDate : '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="proEndDate" label="结束时间">
        <template slot-scope="scope">
          <div class="project-name" @click="navPlanResultList(scope.row)">
            <span>{{ scope.row.proEndDate ? scope.row.proEndDate : '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="projectPeriod" label="时间持续时间">
        <template slot-scope="scope">
          <div class="project-name" @click="navPlanResultList(scope.row)">
            <span>{{ scope.row.projectPeriod ? scope.row.projectPeriod : '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="projectPeriod" label="时间表">
        <template slot-scope="scope">
          <span>暂无数据</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "elTableTemp",
  props: {
    proImplementPlanListTem: {
      type: Array,
      default() {
        return []
      }
    },
    queryParamsTem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    navProDetail({id}) {
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '6',
          tabActiveName: '7'
        }
      })
    },
    //查看成果文件列表
    navPlanResultList({id}) {
      const path = '/proManagement/proImplement/proImplementation/playResults'
      this.$router.push({
        'path': path,
        'query': {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table-temp {
  width: 100%;
  .project-name {
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
