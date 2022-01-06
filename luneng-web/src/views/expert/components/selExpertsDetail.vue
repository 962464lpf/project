<template>
  <div class="app-container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="backPage(0)">返回
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="form.auditStatus === 1"
            type="primary"
            @click="handleUpdate(form)"
            v-hasPermi="['expert:expertReportingRecord:edit']">修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="form.auditStatus === 1"
            type="danger"
            @click="handleDelete(form)"
            v-hasPermi="['expert:expertReportingRecord:remove']">删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="form.auditStatus === 2"
            type="success"
            v-hasPermi="['expert:expertReportingRecord:audit']"
            @click="warehousing">入库
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="form.auditStatus === 2"
            v-hasPermi="['expert:expertReportingRecord:audit']"
            type="warning"
            @click="refuse">拒绝
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <div v-for="(item, index) in selExpertsList" :key="index">
        <re-experts-detail
          :gender-options="genderOptions"
          :nationality-options="nationalityOptions"
          :export-area-options="exportAreaOptions"
          :exert-group-types="exertGroupTypes"
          :re-expert-info="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import reExpertsDetail from "../components/reExpertsDetail";
import {
  delExpertReportingRecord,
  getExpertReportingRecord,
  refuseExpertReportingRecord,
  reportExpertReportingRecord
} from "@/api/expert/expertReportingRecord";

export default {
  name: "selExpertsDetail",
  data() {
    return {
      detailFlag: '0',
      form: {},
      genderOptions: [],
      nationalityOptions: [],
      exportAreaOptions: [],
      exertGroupTypes: [],
      selExpertsList: [],
      id: null,
      reviewFlag: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.init(this.id)
    }
    if (this.$route.query.detailFlag) {
      this.detailFlag = this.$route.query.detailFlag
    }
    if (this.$route.query.reviewFlag) {
      this.reviewFlag = this.$route.query.reviewFlag
    }
    //获取字典信息
    //性别
    this.getDicts("sys_user_sex").then(response => {
      this.genderOptions = response.data;
    })
    //专家的民族
    this.getDicts("sys_nationality").then(response => {
      this.nationalityOptions = response.data;
    })
    //专家的专业领域
    this.getDicts("sys_expert_area").then(response => {
      this.exportAreaOptions = response.data;
    })
    //专家在专家库里的组别
    this.getDicts("expert_group").then(response => {
      this.exertGroupTypes = response.data
    });
  },
  components: {
    reExpertsDetail
  },
  methods: {
    //获取详情
    init(id) {
      getExpertReportingRecord(id).then(({data}) => {
        this.selExpertsList = data.infoList
        this.form = data
      })
    },
    //返回
    backPage(time) {
      if (this.reviewFlag === '1') {
        this.closeView('/expert/reviewExperts/reportSelExperts', '/expert/reviewExperts', time)
      } else if (this.reviewFlag === '2'){
        this.closeView('/expert/selection/selExpertsDetail', '/expert/reviewExperts', time)
      } else {
        this.closeView('/expert/selection/selExpertsDetail', '/expert/selection', time)
      }
    },
    //修改
    handleUpdate(row) {
      const id = row.id
      const path = "/expert/selection/reportSelExperts"
      this.$router.push({
        "path": path,
        'query': {
          id
        }
      })
    },
    //删除
    handleDelete(row) {
      const ids = row.id;
      this.$confirm('是否确认删除当前的专家选拔信息?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delExpertReportingRecord(ids);
      }).then(() => {
        this.backPage(0)
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    //入库
    warehousing() {
      this.$confirm('是否确认入库?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reportExpertReportingRecord(this.id).then(() => {
          this.msgSuccess('入库成功')
          this.backPage(100)
        })
      })
    },
    //拒绝
    refuse() {
      this.$confirm('是否确认拒绝?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        refuseExpertReportingRecord(this.id).then(() => {
          this.msgSuccess('拒绝成功')
          this.backPage(100)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 50px 50px 50px;
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .main,
  .footer{
    width: 100%;
    margin: 20px 0;
  }
}
</style>
