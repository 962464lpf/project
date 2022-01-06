<template>
  <div class="app-container">
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules" label-width="175px">
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="form.projectName"
                placeholder="请填写项目名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="项目地点" prop="projectAddr">
              <el-cascader
                v-model="selectedAddr"
                clearable
                placeholder="请填写项目地点"
                style="width: 100%"
                @change="handleProAddr"
                :props="defaultProp"
                :options="addrOptions">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="设计单位" prop="designUnit">
              <el-input
                v-model="form.designUnit"
                placeholder="请填写设计单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="绿建咨询单位" prop="advisoryUnit">
              <el-input
                v-model="form.advisoryUnit"
                placeholder="请填写绿建咨询单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="绿建标准" prop="criterion">
              <el-select
                :disabled="!!form.criterion"
                v-model="form.criterion"
                placeholder="请选择绿建标准"
                style="width: 100%">
                <el-option
                  v-for="dict in criterionOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="绿建星级" prop="level">
              <el-select
                v-model="form.level"
                placeholder="请选择绿建星级"
                style="width: 100%">
                <el-option
                  v-for="dict in levelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划取得认证时间" prop="attestationTime">
              <el-date-picker
                clearable
                v-model="form.attestationTime"
                type="month"
                style="width: 100%"
                placeholder="请选择计划取得认证时间"
                value-format="yyyy-MM">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="责任单位" prop="enterUnit">
              <el-input
                v-model="form.enterUnit"
                placeholder="请填写责任单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="责任人" prop="personName">
              <el-input
                v-model="form.personName"
                placeholder="请填写责任人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="联系电话" prop="personPhone">
              <el-input
                v-model="form.personPhone"
                placeholder="请填写联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮箱" prop="personEmail">
              <el-input
                v-model="form.personEmail"
                placeholder="请填写邮箱"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="计划开工日期" prop="planStartDate">
              <el-date-picker
                clearable
                v-model="form.planStartDate"
                type="date"
                style="width: 100%"
                placeholder="请选择计划开工日期"
                @change="handleLastDate(1)"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计划竣工日期" prop="planEndDate">
              <el-date-picker
                clearable
                v-model="form.planEndDate"
                type="date"
                style="width: 100%"
                :disabled="!form.planStartDate"
                :picker-options="timePickerOptions"
                placeholder="请选择计划竣工日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="实际开工日期" prop="startDate">
              <el-date-picker
                clearable
                v-model="form.startDate"
                type="date"
                style="width: 100%"
                placeholder="请选择实际开工日期"
                @change="handleLastDate(2)"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实际竣工日期" prop="endDate">
              <el-date-picker
                clearable
                v-model="form.endDate"
                type="date"
                style="width: 100%"
                :disabled="!form.startDate"
                :picker-options="timePickerOptions2"
                placeholder="请选择实际竣工日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import addrList from '@/assets/address.json'
import {greenBuildProEdit} from "@/utils/el_validate";
import {addBuildInfo, getBuildInfo, updateBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "editProInfo",
  data() {
    return {
      // 表单参数
      form: {
        id: undefined,
        projectName: undefined,
        projectAddr: undefined,
        designUnit: undefined,
        advisoryUnit: undefined,
        criterion: '1',
        level: undefined,
        attestationTime: undefined,
        enterUnit: undefined,
        personName: undefined,
        personPhone: undefined,
        personEmail: undefined,
        planStartDate: undefined,
        planEndDate: undefined,
        startDate: undefined,
        endDate: undefined
      },
      //表单验证
      rules: greenBuildProEdit,
      //绿建等级字典
      levelOptions: [],
      // 绿建标准字典
      criterionOptions: [],
      //省市选择
      defaultProp: {
        label: 'name',
        value: 'name',
        children: 'sub'
      },
      addrOptions: addrList,
      selectedAddr: [],
      //跳转项目id
      id: null,
      proDetailFlag: null,
      tabActiveName: null
    }
  },
  created() {
    //获取数据
    if (this.$store.state.user.userInfo.dept.deptName) {
      this.form.enterUnit = this.$store.state.user.userInfo.dept.deptName
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.init(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    //获取字典数据
    this.getDicts("build_criterion").then(response => {
      this.criterionOptions = response.data;
    });
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
  },
  computed: {
    timePickerOptions() {
      if (this.form.planStartDate) {
        const planStartDate = new Date(this.form.planStartDate).getTime()
        return {
          disabledDate(date) {
            return date.getTime() < planStartDate
          }
        }
      }
    },
    timePickerOptions2() {
      if (this.form.startDate) {
        const startDate = new Date(this.form.startDate).getTime()
        return {
          disabledDate(date) {
            return date.getTime() < startDate
          }
        }
      }
    }
  },
  methods: {
    /* ************************ 数据获取及处理 *************************/
    //修改按钮进入查询信息
    init(id) {
      getBuildInfo(id).then(({data}) => {
        this.form = data
        this.selectedAddr = this.form.projectAddr.split('-')
      })
    },
    /* ************************ 交互操作 *************************/
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.id = this.id
          if (this.id) {  //修改
            this.updateBuildProInfo(this.form)
          } else {
            this.addBuildProInfo(this.form)
          }
        }
      })
    },
    //处理竣工时间
    handleLastDate(num) {
      if (num === 1) {
        if (this.form.planStartDate && this.form.planEndDate) {
          const planStartDate = new Date(this.form.planStartDate).getTime()
          const planEndDate = new Date(this.form.planEndDate).getTime()
          if (planEndDate <= planStartDate) {
            this.form.planEndDate = ''
            this.msgError('开工日期不能大于竣工日期，请重新选择计划竣工时间')
          }
        }
      } else {
        if (this.form.startDate && this.form.endDate) {
          const startDate = new Date(this.form.startDate).getTime()
          const endDate = new Date(this.form.endDate).getTime()
          if (endDate <= startDate) {
            this.form.endDate = ''
            this.msgError('开工日期不能大于竣工日期，请重新选择实际竣工时间')
          }
        }
      }
    },
    //处理地点
    handleProAddr(value) {
      this.form.projectAddr = value[0] + '-' + value[1]
    },
    //更新
    updateBuildProInfo(form) {
      updateBuildInfo(form).then(({code}) => {
        if (code === 200) {
          this.msgSuccess("修改成功")
          if (this.proDetailFlag) {
            this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
          } else {
            this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject", 0)
          }
        }
      })
    },
    //新增
    addBuildProInfo(form) {
      addBuildInfo(form).then(({code}) => {
        if (code === 200) {
          this.msgSuccess("新增成功")
          if (this.proDetailFlag) {
            this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
          } else {
            this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject", 0)
          }
        }
      })
    },
    //返回页面
    cancel() {
      if (this.proDetailFlag) {
        this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/buildEnvironment/build/buildProject/editProInfo", "/buildEnvironment/build/buildProject", 0)
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 30px 50px 30px;
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .footer {
    width: 20%;
    margin-top: 40px;
    margin-right: 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
