<template>
  <div class="app-container">
    <div class="header">
      <el-button
        type="primary"
        @click="backPage">返回
      </el-button>
      <el-button
        type="warning"
        @click="submitConfirm(1)">保存
      </el-button>
      <el-button
        type="success"
        @click="submitConfirm(2)">提交
      </el-button>
    </div>
    <div class="main">
      <div v-for="(item, index) in selExpertsList" :key="index">
        <selExpertsAdd
          :re-expert-info="item"
          :ref="'expertForm' + index"
          :cur-index="index"
          :recommendId="id"
          :gender-options="genderOptions"
          :nationality-options="nationalityOptions"
          :export-area-options="exportAreaOptions"
          @back-fill-form="getFormItem"
          @delete-expert-info="deleteExpertInfo"
        />
      </div>
    </div>
    <div class="footer">
      <el-button
        type="primary"
        @click="carryOnAdd">继续添加
      </el-button>
    </div>
  </div>
</template>

<script>
import selExpertsAdd from "../components/selExpertsAdd";
import {
  addExpertReportingRecord,
  getExpertReportingRecord,
  updateExpertReportingRecord
} from "@/api/expert/expertReportingRecord";

let ReExpertInfo = function (options) {
  this.name = options.name
  this.gender = options.gender
  this.birthday = options.birthday
  this.nationality = options.nationality
  this.education = options.education
  this.major = options.major
  this.workUnit = options.workUnit
  this.job = options.job
  this.jobLevel = options.jobLevel
  this.exportArea = options.exportArea
  this.zycj = options.zycj
  this.reviewExperience = options.reviewExperience
  this.unitIdea = options.unitIdea
  this.filePaths = options.filePaths
  this.orderSort = options.orderSort
}

export default {
  name: "reportSelExperts",
  data() {
    return {
      genderOptions: [],
      nationalityOptions: [],
      exportAreaOptions: [],
      selExpertsList: [],
      options: {
        name: null,
        gender: null,
        birthday: null,
        nationality: null,
        education: null,
        major: null,
        workUnit: null,
        job: null,
        jobLevel: null,
        exportArea: null,
        zycj: null,
        reviewExperience: null,
        unitIdea: null,
        filePaths: null,
        orderSort: 1
      },
      id: null,
      noticeId: null,
      fromFullPath: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getSelExpertsList(this.id)
    } else {
      this.selExpertsList = []
      const reExpertInfo = new ReExpertInfo(this.options)
      this.selExpertsList.push(reExpertInfo)
    }
    if (this.$route.query.noticeId) {
      this.noticeId = this.$route.query.noticeId * 1
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
  },
  components: {
    selExpertsAdd
  },
  methods: {
    //获取专家信息
    getSelExpertsList(id) {
      getExpertReportingRecord(id).then(({data}) => {
        if (data.infoList && data.infoList.length > 0) {
          this.selExpertsList = []
          this.selExpertsList = data.infoList
        }
      })
    },
    //获取单个所填信息
    getFormItem(value) {
      this.selExpertsList.forEach(item => {
        if (item.orderSort === value.orderSort) {
          item = value
        }
      })
    },
    //返回
    backPage() {
      this.closeView(this.$route.path, this.fromFullPath, 0)
    },
    //点击保存或提交
    submitConfirm(type) {
      let rulesList = []
      this.selExpertsList.forEach((item, index) => {
        rulesList.push(this.checkForm(index))
      })
      Promise.all(rulesList).then(() => {
        this.submitExpertsInfo(type)
      }).catch(() => {
        console.log('验证不通过')
      })
    },
    //保存或提交专家信息表单
    submitExpertsInfo(type) {
      if (type === 1) { //保存
        this.AddOrUpdateForm(type)
      } else { // 提交
        this.AddOrUpdateForm(type)
      }
    },
    //新增或修改信息接口
    AddOrUpdateForm(type) {
      const auditStatus = type === 1 ? 1 : 2
      if (this.id) { //修改
        updateExpertReportingRecord({
          id: this.id,
          auditStatus: auditStatus,
          expertList: JSON.stringify(this.selExpertsList)
        }).then(() => {
          this.msgSuccess('修改成功')
          this.backPage()
        })
      } else {
        addExpertReportingRecord({
          noticeId: this.noticeId,
          auditStatus: auditStatus,
          expertList: JSON.stringify(this.selExpertsList)
        }).then(() => {
          this.msgSuccess('新增成功')
          this.backPage()
        })
      }
    },
    //检查表单的方法
    checkForm(formNameIndex) {
      const expertForm = 'expertForm' + formNameIndex
      const form = 'form' + formNameIndex
      return new Promise((resolve, reject) => {
        this.$refs[expertForm][0].$refs[form].validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    //继续添加
    carryOnAdd() {
      const length = this.selExpertsList.length
      this.options.orderSort = this.selExpertsList[length - 1].orderSort + 1
      const reExpertInfo = new ReExpertInfo(this.options)
      this.selExpertsList.push(reExpertInfo)
    },
    //删除从第二个开始的专家信息
    deleteExpertInfo(index) {
      this.selExpertsList.splice(index, 1)
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
  .footer {
    display: flex;
    justify-content: center;
  }
}
</style>
