<template>
  <div class="app-container">
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="form.projectName"
                placeholder="请填写项目名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="项目编码" prop="projectCode">
              <el-input
                v-model="form.projectCode"
                placeholder="请填写项目编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="申报单位" prop="declareUnit">
              <el-input
                v-model="form.declareUnit"
                placeholder="请填写申报单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="项目类别" prop="projectType">
              <el-input
                v-model="form.projectType"
                placeholder="请填写项目类别"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="项目属性" prop="projectAttr">
              <el-select
                v-model="form.projectAttr"
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
          <el-col :span="10">
            <el-form-item label="研究领域" prop="researchField">
              <el-select
                v-model="form.researchField"
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
          <el-col :span="20">
            <el-form-item label="主要研究内容" prop="mainContent">
              <el-input
                v-model="form.mainContent"
                :rows="5"
                type="textarea"
                placeholder="请填写主要研究内容，建议300字，不超过500字"
                maxlength="500"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="预期目标" prop="expectedTarget">
              <el-input
                v-model="form.expectedTarget"
                :rows="3"
                type="textarea"
                placeholder="请填写预期目标，建议100字，不超过200字"
                maxlength="200"
                show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="承担单位" prop="undertakeUnit">
              <el-input
                v-model="form.undertakeUnit"
                placeholder="请填写承担单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="实施单位" prop="implementationUnit">
              <el-input
                v-model="form.implementationUnit"
                placeholder="请填写实施单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="起止时间" prop="proBeginDate">
              <el-date-picker
                clearable
                v-model="dateRange"
                type="monthrange"
                style="width: 100%"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM"
                @change="dateChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="项目负责人" prop="headName">
              <el-input
                v-model="form.headName"
                placeholder="请填写项目负责人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="项目负责人职务" prop="headDuty">
              <el-input
                v-model="form.headDuty"
                placeholder="请填写项目负责人职务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人姓名" prop="linkMan">
              <el-input
                v-model="form.linkMan"
                placeholder="请填写联系人姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="联系人职务" prop="linkDuty">
              <el-input
                v-model="form.linkDuty"
                placeholder="请填写联系人职务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人电话" prop="linkPhone">
              <el-input
                v-model="form.linkPhone"
                placeholder="请填写联系人电话"
              />
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
            <el-form-item label="下年投入计划(成本性)" prop="planInvestment">
              <m-input
                v-model="form.planInvestment"
                placeholder="请输入金额"
                inputType="wanYuan">
              </m-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
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
<!--        <el-row :gutter="40">-->
<!--          <el-col>-->
<!--            <el-form-item label="可研报告" prop="feasibleFilePaths">-->
<!--              <upload-->
<!--                accept=".pdf"-->
<!--                :size="50"-->
<!--                v-model="form.feasibleFilePaths"/>-->
<!--              <div class="el-upload__tip" style="color: red">-->
<!--                仅支持PDF格式的文件，最大50MB-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <div class="footer">
          <el-form-item>
            <div class="btns">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addProApprovalInfo, getProApprovalInfo, saveProOptLog, updateProApprovalInfo, validProjectCode} from "@/api/pro/proApprovalInfo";
import {proEstablishEdit} from "@/utils/el_validate";

export default {
  name: "EditProInfo",
  data() {
    return {
      // 表单参数
      form: {
        id: null,
        projectName: null,
        projectCode: null,
        declareUnit: null,
        projectType: null,
        projectAttr: null,
        researchField: null,
        mainContent: null,
        expectedTarget: null,
        undertakeUnit: null,
        headName: null,
        headDuty: null,
        linkMan: null,
        linkDuty: null,
        linkPhone: null,
        totalInvestment: null,
        planInvestment: null,
        remark: null,
        feasibleFilePaths: null
      },
      //表单验证
      rules: proEstablishEdit,
      dateRange: [],
      //传入的infoID
      infoId: null,
      //字典
      projectTypeOptions: [],
      projectAttrOptions: [],
      researchFieldOptions: [],
      proDetailFlag: null,
      tabActiveName: null
    }
  },
  created() {
    //获取数据
    this.id = this.$route.query.id
    if (this.id) {
      this.init(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    //获取字典信息
    this.getDicts("project_storage_attri").then(response => {
      this.projectAttrOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    });
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  methods: {
    /* ************************ 数据获取及处理 *************************/
    //修改按钮进入查询信息
    init(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.form = data;
        this.form.setupStatus = undefined;
        this.dateRange = [this.form.proBeginDate, this.form.proEndDate];
      })
    },
    /* ************************ 交互操作 *************************/
    //选定时间处理
    dateChange(value) {
      if (value && value.length > 0) {
        this.form.proBeginDate = value[0];
        this.form.proEndDate = value[1];
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          validProjectCode(this.form).then(response => {
            if (!response.data) {
              this.msgError('项目编码已存在！')
            } else {
              if (this.id !== null) {  //修改
                this.form.id = this.id
                updateProApprovalInfo(this.form).then(({code}) => {
                  if (code === 200) {
                    saveProOptLog({
                      infoId: this.id,
                      operName: '修改了项目基本信息',
                      operUserName: this.userName,
                      operType: 1
                    }).then(() => {})
                    this.msgSuccess("修改成功")
                  }
                })
              } else {
                this.form.id = this.id
                addProApprovalInfo(this.form).then(({code}) => { //新增
                  if (code === 200) {
                    saveProOptLog({
                      infoId: this.id,
                      operName: '新增了项目基本信息',
                      operUserName: this.userName,
                      operType: 1
                    }).then(() => {})
                    this.msgSuccess("新增成功")
                  }
                })
              }
            }
          })
        }
      })
    },

    //返回页面
    cancel() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proEstablish/editProInfo", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proEstablish/editProInfo", "/proManagement/proImplement/proEstablish", 0)
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
  padding: 30px 30px 50px 30px;
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
