<template>
  <div class="app-container" style="padding-top: 30px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" style="padding-right: 100px;">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="projectForm.projectName" type="text" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :sm="24" :md="12">
          <el-form-item label="记录时间" prop="recordDate">
            <el-date-picker
              clearable
              style="width: 240px"
              v-model="form.recordDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择记录时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" :sm="24" :md="12">
          <el-form-item label="地点" prop="happenAddr">
            <el-input v-model="form.happenAddr" type="input" placeholder="请输入地点" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" :sm="24" :md="12">
          <el-form-item label="经办人" prop="agent">
            <el-input v-model="form.agent" placeholder="请输入经办人" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :sm="24" :md="12">
          <el-form-item label="责任人" prop="dutyPerson">
            <el-input v-model="form.dutyPerson" placeholder="请输入责任人" maxlength="10" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="问题描述" prop="questionDesc">
            <el-input v-model="form.questionDesc" type="textarea" placeholder="请输入问题描述" rows="4" maxlength="300" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="类别" prop="questionType">
            <el-input v-model="form.questionType" placeholder="请输入类别" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: center;padding: 20px 0;">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel(0, 'management')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getHbRectRecord, addHbRectRecord, updateHbRectRecord } from "@/api/hb/hbRectRecord";
import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";
import { presenter } from '@/components/Crud/crud';

export default {
  name: "buildEnvironment-environment-dc-add",
  mixins: [presenter()],
  data() {
    return {
      // 表单参数
      form: {
        completeStatus: 0
      },
      projectForm: {},
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        recordDate: [
          { required: true, message: "记录时间不能为空", trigger: "blur" }
        ],
        happenAddr: [
          { required: true, message: "地点不能为空", trigger: "blur" }
        ],
        agent: [
          { required: true, message: "经办人不能为空", trigger: "blur" }
        ],
        dutyPerson: [
          { required: true, message: "责任人不能为空", trigger: "blur" }
        ],
        questionDesc: [
          { required: true, message: "问题描述不能为空", trigger: "blur" }
        ],
        questionType: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        rectMeasures: [
          { required: true, message: "整改措施不能为空", trigger: "blur" }
        ],
        planCompleteDate: [
          { required: true, message: "计划完成时间不能为空", trigger: "blur" }
        ],
        currentProgress: [
          { required: true, message: "目前进展情况不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    infoId() {
      return this.$route.query.infoId;
    },
    recordType() {
      return this.$route.query.recordType;
    },
    pageType() {
      return this.$route.query.pageType || undefined;
    },
    from() {
      return this.$route.query.from;
    }
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      const id = this.id;
      const infoId = this.infoId;
      if(id) {
        getHbRectRecord(id).then(response => {
          this.form = response.data;
        });
      }
      if(infoId) {
        getHbProjectInfo(infoId).then(response => {
          this.projectForm = response.data;
        });
      }
    },
    // 取消按钮
    cancel(time = 0, management) {
      const path = this.$route.path;
      let toPath = '';
      if (this.recordType == 1) toPath = `/buildEnvironment/environment/management/record?infoId=${this.infoId}&recordType=${this.recordType}`;
      if (this.recordType == 2) toPath = `/buildEnvironment/environment/management/zc?infoId=${this.infoId}&recordType=${this.recordType}`;
      if (this.recordType == 3) toPath = `/buildEnvironment/environment/management/dc?infoId=${this.infoId}&recordType=${this.recordType}`;
      if (this.from === 'management' && management) {
        toPath = '/buildEnvironment/environment/management';
      }
      this.closeView(path, toPath, time);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.projectName = this.projectForm.projectName;
      this.form.infoId = this.infoId;
      this.form.recordType = this.recordType;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateHbRectRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.cancel(1000);
              }
            });
          } else {
            addHbRectRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.cancel(1000);
              }
            });
          }
        }
      });
    }
  }
};
</script>
