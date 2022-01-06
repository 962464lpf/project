<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="200px">
      <el-row :gutter="40">
        <el-col :span="18">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入项目名称，不超过30字"
              maxlength="30"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9">
          <el-form-item label="分级评分" prop="reviewResult">
            <el-select
              v-model="form.reviewResult"
              placeholder="请选择分级评分"
            >
              <el-option
                v-for="dict in levelOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="申报单位" prop="subordinateUnit">
            <el-input
              v-model="form.subordinateUnit"
              placeholder="请输入申报单位，不超过30字"
              maxlength="30"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="18">
          <el-form-item label="项目类别" prop="type">
            <el-input
              v-model="form.type"
              placeholder="请输入项目类别，不超过30字" maxlength="30"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9">
          <el-form-item label="项目属性" prop="attri">
            <el-select
              v-model="form.attri"
              placeholder="请选择项目属性"
              style="width: 100%">
              <el-option
                v-for="dict in projectAttrOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="研究领域" prop="area">
            <el-select
              v-model="form.area"
              placeholder="请选择研究领域"
              style="width: 100%">
              <el-option
                v-for="dict in researchFieldOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="18">
          <el-form-item label="主要研究内容" prop="content">
            <el-input
              v-model="form.content"
              :rows="5"
              type="textarea"
              placeholder="请输入主要研究内容，建议300字，不超过500字。"
              maxlength="500"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="18">
          <el-form-item label="预期目标" prop="target">
            <el-input
              v-model="form.target"
              :rows="3"
              type="textarea"
              placeholder="请输入预期目标，建议100字，不超过200字。"
              maxlength="200"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9">
          <el-form-item label="承担单位" prop="undertakeUnit">
            <el-input
              v-model="form.undertakeUnit"
              placeholder="请输入承担单位，不超过30字"
              maxlength="30"/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="实施单位" prop="implementationUnit">
            <el-input
              v-model="form.implementationUnit"
              placeholder="请输入实施单位，不超过30字"
              maxlength="30"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="9">
          <el-form-item label="起止时间" prop="dateRange">
            <el-date-picker
              v-model="form.dateRange"
              type="monthrange"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
              @change="dateChange">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="项目负责人" prop="headName">
            <el-input
              v-model="form.headName"
              placeholder="请输入项目负责人"
              maxlength="10"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="10">
          <el-form-item label="项目总投入(成本性)" prop="totalInvestment">
            <m-input
              v-model="form.totalInvestment"
              placeholder="请输入金额"
              inputType="wanYuan">
            </m-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="10">
          <el-form-item :label="label" prop="planInvestment">
            <m-input
              v-model="form.planInvestment"
              placeholder="请输入金额"
              inputType="wanYuan">
            </m-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="18">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              :rows="3"
              type="textarea"
              placeholder="请填写备注，不超过200字"
              maxlength="200"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col>
          <el-form-item label="可研报告" prop="feasibleUrl">
            <upload
              accept=".pdf"
              :size="50"
              v-model="form.feasibleUrl"/>
            <div class="el-upload__tip" style="color: red">
              仅支持PDF格式的文件，最大50MB
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="footer">
        <el-form-item>
          <div class="btns">
            <el-button type="primary"  @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

  import {addProjectStorageInfo} from "@/api/storage/library";

  export default {
    data() {
      return {
        // 表单参数
        form: {},
        //表单验证
        rules: {
          projectName: [
            {required: true, message: "项目名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          reviewResult: [
            {required: true, message: "分级评分不能为空", trigger: "blur"}
          ],
          subordinateUnit: [
            {required: true, message: "申报单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          type: [
            {required: true, message: "项目类别不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          dateRange: [
            {required: true, message: "起止时间不能为空", trigger: "blur"}
          ],
          attri: [
            {required: true, message: "项目属性不能为空", trigger: "blur"}
          ],
          area: [
            {required: true, message: "研究领域不能为空", trigger: "blur"}
          ],
          content: [
            {required: true, message: "主要研究内容不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          target: [
            {required: true, message: "预期目标不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          undertakeUnit: [
            {required: true, message: "承担单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          implementationUnit: [
            {required: true, message: "实施单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          headName: [
            {required: true, message: "项目负责人不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          totalInvestment: [
            {required: true, message: "项目总投入不能为空", trigger: "blur"},
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额", trigger: "blur"}
          ],
          planInvestment: [
            {required: true, message: new Date().getFullYear() + 1 + "年计划投入不能为空", trigger: "blur"},
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额", trigger: "blur"}
          ],
          feasibleUrl: [
            {required: true, message: "可研报告不能为空", trigger: "blur"}
          ]
        },
        dateRange: null,
        //传入的infoID
        infoId: null,
        label: new Date().getFullYear() + 1 + "年计划投入（成本性）",
        //字典
        projectTypeOptions: [],
        projectAttrOptions: [],
        researchFieldOptions: [],
        // 等级字典
        levelOptions: [],
      }
    },
    created() {
      //获取字典信息
      this.getDicts("project_storage_level").then(response => {
        response.data.some(dict => {
          if (dict.dictValue != 4) {
            this.levelOptions.push(dict);
          }
        })

      });
      this.getDicts("project_storage_attri").then(response => {
        this.projectAttrOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.researchFieldOptions = response.data;
      });
    },
    methods: {
      /* ************************ 交互操作 *************************/
      //选定时间处理
      dateChange(value) {
        console.log(value);
        if (value && value.length > 0) {
          this.form.beginDate = value[0]
          this.form.endDate = value[1]
        }
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            addProjectStorageInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("添加成功");
                this.cancel();
              }
            });
          }
        })
      },
      // 表单重置
      reset() {
        this.form = {
          declareYear: undefined,
          projectName: undefined,
          subordinateUnit: undefined,
          type: undefined,
          attri: undefined,
          area: undefined,
          content: undefined,
          target: undefined,
          undertakeUnit: undefined,
          beginDate: undefined,
          endDate: undefined,
          headName: undefined,
          totalInvestment: undefined,
          planInvestment: undefined,
          expertGroupId: undefined,
          reviewResult: undefined,
          status: undefined,
          remark: undefined,
          feasibleUrl: undefined,
          dateRange: []
        };
        this.resetForm("form");
      },
      //返回页面
      cancel() {
        this.reset();
        this.closeView("/proManagement/storage/library/add", "/proManagement/storage/library", 0)
      }
    }
  }

</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px;

    .main {
      width: 100%;
      display: flex;
      flex-direction: column;

      .footer {
        width: 100%;

        .btns {
          width: 20%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
