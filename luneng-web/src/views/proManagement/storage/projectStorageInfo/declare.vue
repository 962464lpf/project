<template>
  <div>
    <el-row v-if="add && noticeSend">
      <el-col :span="24">
        <el-form-item label="通知" prop="noticeId">
          <el-select v-model="form.noticeId" placeholder="请选择评选通知" style="width: 100%;" :disabled="!edit"
                     @change="submitForm">
            <el-option
              v-for="item in selNoticeOptions"
              :key="item.id"
              :label="item.noticeTitle"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="form.projectName"
            placeholder="请输入项目名称，不超过30字"
            maxlength="30"
            :disabled="!edit"
            @blur="submitForm"
            show-word-limit/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="申报单位" prop="subordinateUnit">
          <el-input
            v-model="form.subordinateUnit"
            placeholder="请输入申报单位，不超过30字"
            maxlength="30"
            :disabled="!edit"
            @blur="submitForm"
            show-word-limit/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="项目类别" prop="type">
          <el-input v-model="form.type" placeholder="请输入项目类别，不超过30字" maxlength="30" :disabled="!edit"
                    @blur="submitForm" show-word-limit/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目属性" prop="attri">
          <el-select v-model="form.attri" placeholder="请选择项目属性" :disabled="!edit" @change="submitForm">
            <el-option
              v-for="dict in attriOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="研究领域" prop="area">
          <el-select
            v-model="form.area"
            placeholder="请选择研究领域"
            :disabled="!edit"
            @change="submitForm">
            <el-option
              v-for="dict in areaOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="主要研究内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入主要研究内容，建议300字，不超过500字。"
            maxlength="500"
            show-word-limit
            :disabled="!edit"
            @blur="submitForm"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="预期目标" prop="target">
          <el-input
            v-model="form.target"
            type="textarea"
            :rows="4"
            placeholder="请输入预期目标，建议100字，不超过200字。"
            maxlength="200"
            show-word-limit
            :disabled="!edit"
            @blur="submitForm"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="承担单位" prop="undertakeUnit">
          <el-input
            v-model="form.undertakeUnit"
            placeholder="请输入承担单位，不超过30字"
            :disabled="!edit"
            @blur="submitForm"
            maxlength="30"
            show-word-limit/>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="实施单位" prop="implementationUnit">
          <el-input
            v-model="form.implementationUnit"
            placeholder="请输入实施单位，不超过30字"
            :disabled="!edit"
            @blur="submitForm"
            maxlength="30"
            show-word-limit/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="起止时间" prop="beginDate">
          <el-date-picker
            :disabled="!edit"
            v-model="dateRange"
            type="monthrange"
            align="right"

            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            @change="submitForm(true)"
            end-placeholder="结束日期"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="项目负责人" prop="headName">
          <el-input
            v-model="form.headName"
            placeholder="请输入项目负责人"
            :disabled="!edit"
            @blur="submitForm"
            maxlength="10"
            show-word-limit/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目总投入" prop="totalInvestment">
          <m-input
            v-model="form.totalInvestment"
            inputType="wanYuan"
            placeholder="请输入金额"
            :disabled="!edit"
            @blur="submitForm"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="label" prop="planInvestment" label-width="130px">
          <m-input
            v-model="form.planInvestment"
            inputType="wanYuan"
            placeholder="请输入金额"
            :disabled="!edit"
            @blur="submitForm"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请填写备注，不超过200字。"
            maxlength="200"
            show-word-limit
            :disabled="!edit"
            @blur="submitForm"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="edit && !hiddenTypeRadio">
      <el-col :span="24">
        <el-form-item label="">
          <el-radio v-model="form.submitType" label="0">项目建议书</el-radio>
          <el-radio v-model="form.submitType" label="1">可研报告</el-radio>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {listSelNotice} from "@/api/sel/selNotice";
  import {getDept} from "@/api/system/dept";
  import {getConfigByKey} from "@/api/system/config"
  import {updateProjectStorageInfo,getProjectNoticeSend} from "@/api/storage/projectStorageInfo";
  import MInput from "@/components/MInput";

  export default {
    components: {
      MInput
    },
    data() {
      return {
        // 项目属性字典
        attriOptions: [],
        // 研究领域字典
        areaOptions: [],
        // 状态字典
        statusOptions: [],
        // 表单参数
        form: {},
        selNoticeOptions: [],
        dateRange: [],
        label: new Date().getFullYear() + 1 + "年计划投入",
        query: {
          type: 2,
          kind: 2,
          declareChannelStatus: null
        },
        // 申报通道
        config: {},
        noticeSend:true
      };
    },
    props: {
      value: {
        default: ''
      },
      edit: {
        default: true
      },
      hiddenTypeRadio: {
        default: false
      },
      add: {
        default: false
      }
      // declareChannelStatus: ""
    },
    created() {
      this.form = this.value;
      this.getConfigByKey();
      this.getProjectNoticeSendStatus();
      this.getDicts("project_storage_attri").then(response => {
        this.attriOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.areaOptions = response.data;
      });
      // this.query.declareChannelStatus = this.declareChannelStatus;
    },
    activated() {
      this.getConfigByKey();
      this.getProjectNoticeSendStatus();
    },
    methods: {
      // 获取申报通道状态
      getConfigByKey() {
        getConfigByKey("declare_channel_status").then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              this.config = res.data[0];
              this.getNoticeList();
            }
          }
        })
      },
      getNoticeList() {
        this.query.declareChannelStatus = this.config.configValue
        listSelNotice(this.query).then(response => {
          this.selNoticeOptions = response.rows;
        });
      },
        //发送储备通知标识
      getProjectNoticeSendStatus(){
          getProjectNoticeSend().then(res =>{
              this.noticeSend = res.data == 'false'
          });
      },
      // 项目属性字典翻译
      attriFormat(row, column) {
        return this.selectDictLabel(this.attriOptions, row.attri);
      },
      // 研究领域字典翻译
      areaFormat(row, column) {
        return this.selectDictLabel(this.areaOptions, row.area);
      },
      // 状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.dateRange = [];
        this.reset();
      },
      submitForm(isDate) {
        if (isDate && this.dateRange) {
          this.form.beginDate = this.dateRange[0];
          this.form.endDate = this.dateRange[1];
          this.$emit('input', this.form);
        }
        if (this.edit && !this.hiddenTypeRadio) return;
        updateProjectStorageInfo(this.form).then(res => {
          this.$emit('update');
        });
      }
    },
    watch: {
      value(newVal, oldVal) {
        this.form = newVal;
        if (this.form.beginDate && this.form.endDate) {
          this.dateRange = [this.form.beginDate, this.form.endDate];
        } else {
          this.dateRange = [];
        }
        this.getConfigByKey();
      },
      // declareChannelStatus: {
      //   handler: function (newVal) {
      //     this.query.declareChannelStatus = newVal;
      //     this.getNoticeList();
      //   },
      // }
    }
  };
</script>
