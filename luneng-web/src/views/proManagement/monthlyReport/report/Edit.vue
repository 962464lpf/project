<template>
  <div class="app-container">
    <el-row>
      <el-col class="report-name">
        <span>{{ form.reportName }}</span>
      </el-col>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="项目名称：" prop="projectName">
        <el-input
          v-model="form.projectName"
          placeholder="项目名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="承担单位：" prop="undertakeUnit">
        <el-input
          :disabled="true"
          v-model="form.undertakeUnit"
          placeholder="承担单位"
        />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="填报人：" prop="filledBy">
            <el-input
              v-model="form.filledBy"
              placeholder="填报人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话：" prop="linkPhone">
            <el-input
              v-model="form.linkPhone"
              placeholder="联系电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="label-text">
          项目研究进度及取得的成果：
        </el-col>
      </el-row>
      <el-form-item prop="content1">
        <el-input
          v-model="form.content1"
          type="textarea"
          placeholder="请输入内容"
          rows="4"
          show-word-limit/>
      </el-form-item>
      <el-row>
        <el-col class="label-text">
          任务完成情况(对照任务书，列述研究任务和重要节点完成进展情况)：
        </el-col>
      </el-row>
      <el-form-item prop="content2">
        <el-input
          v-model="form.content2"
          type="textarea"
          placeholder="请输入内容"
          rows="6"
          show-word-limit/>
      </el-form-item>
      <el-row>
        <el-col class="label-text">
          存在问题及解决措施：
        </el-col>
      </el-row>
      <el-form-item prop="content3">
        <el-input
          v-model="form.content3"
          type="textarea"
          placeholder="请输入内容"
          rows="4"
          show-word-limit/>
      </el-form-item>
      <el-row>
        <el-col class="label-text">
          下月工作计划安排：
        </el-col>
      </el-row>
      <el-form-item prop="content4">
        <el-input
          v-model="form.content4"
          type="textarea"
          placeholder="请输入内容"
          rows="3"
          show-word-limit/>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="footer">
      <el-col :span="4">
        <el-button type="primary" @click="submitForm(1)">提 交</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="submitForm(0)">保 存</el-button>
      </el-col>
      <el-col :span="4">
        <el-button @click="cancel">取 消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getProMonthReportRecord,
  updateProMonthReportRecord
} from "@/api/pro/proMonthReportRecord";

export default {
  name: 'Edit',
  data() {
    return {
      // 表单参数
      form: {},
      fromFullPath: '',
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        undertakeUnit: [
          { required: true, message: "承担单位不能为空", trigger: "blur" }
        ],
        filledBy: [
          { required: true, message: "填报人不能为空", trigger: "blur" },
          {
            pattern: /^(\S)[\w\u4E00-\u9FA5\s]{0,8}(\S)$/,
            message: "请输入正确格式的填报人姓名",
            trigger: "blur"
          }
        ],
        linkPhone: [
          { required: true, message: "联系电话", trigger: "blur" },
          {pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: "blur"}
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  created() {
    this.init();
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    init() {
      if(!this.id) return;
      getProMonthReportRecord(this.id).then(({data}) => {
        this.form = data
      });
    },
    /** 提交按钮 */
    submitForm(status) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.reportStatus = status
          updateProMonthReportRecord(this.form).then(() => {
            this.msgSuccess(`${status === 0 ? '保存成功' : '提交成功'}`)
            this.cancel()
          })
        }
      })
    },
    // 取消按钮
    cancel(time = 0) {
      this.closeView(this.$route.path, this.fromFullPath, time);
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 400px 60px 30px;
  .report-name {
    font-size: 20px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .label-text {
    color: #606266;
    font-size: 18px;
    font-weight: bold;
    padding-left: 30px;
    margin-bottom: 5px;
  }
  .footer {
    padding-left: 300px;
  }
}
</style>
