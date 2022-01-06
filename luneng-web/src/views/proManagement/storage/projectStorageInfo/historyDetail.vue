<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-back"

          @click="handleBack"
        >返回
        </el-button>
      </el-col>
    </el-row>
    <div class="detail-title">{{form.projectName}}</div>
    <div class="detail-hint">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime,
      '{y}-{m}-{d}')}}
    </div>
    <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
      <el-radio-button label="1">项目基本信息</el-radio-button>
      <el-radio-button v-if="form.submitType === '0'" label="2">项目建议书</el-radio-button>
      <el-radio-button label="3">项目可研报告</el-radio-button>
    </el-radio-group>
    <el-form v-show="tabIndex == '1'" label-width="108px">
      <declareContent v-model="form" :edit="false"/>
    </el-form>
    <el-form v-if="tabIndex == '2'">
      <PdfView :src="form.adviceUrl" />
    </el-form>
    <div v-if="tabIndex == '3'">
      <PdfView :src="form.feasibleUrl" />
      <reportDetail v-model="form" :edit="false"/>
    </div>
  </div>
</template>

<script>
  import {getProjectStorageInfo, listProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import {listProjectStorageAdvice} from "@/api/storage/projectStorageAdvice";
  import proposalContent from './proposal/index';
  import declareContent from './declare';
  import reportDetail from './report-detail';
  import {getProjectStorageAudit} from "@/api/storage/audit";
  import {listOperLog} from "@/api/storage/operLog";
  import PdfView from "@/components/PdfView";

  export default {
    components: {
      proposalContent, declareContent, reportDetail, PdfView
    },
    data() {
      return {
        // 项目通知ID字典
        noticeIdOptions: [],
        // 申报年度字典
        declareYearOptions: [],
        // 项目类别字典
        typeOptions: [],
        // 项目属性字典
        attriOptions: [],
        // 研究领域字典
        areaOptions: [],
        // 状态字典
        statusOptions: [],
        // 表单参数
        form: {},
        tabIndex: '1',
        proposalForm: {},
        activeName: '1',
        // 总条数
        total: 0,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        // 历史版本总条数
        historyTotal: 0,
        // 历史版本查询条件
        historyQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        logList: [],
        // 历史版本
        historyVersions: []
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      },
      type: function () {
        return this.$route.query.type
      }
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
      this.getDicts("project_storage_attri").then(response => {
        this.attriOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.areaOptions = response.data;
      });
      this.getDicts("project_storage_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        getProjectStorageInfo(id).then(response => {
          this.form = response.data;
        });
        // listProjectStorageAdvice({
        //   infoId: id
        // }).then(response => {
        //   if (response.rows.length > 0) {
        //     this.proposalForm = response.rows[0];
        //   }
        // });
      },
      /** 返回 */
      handleBack() {
        let toPath = "";
        if (this.type === 1) {
          toPath = "/proManagement/storage/projectStorageInfo/detail?id=" + this.form.infoId;
        } else if (this.type === 2) {
          toPath = "/proManagement/storage/audit/detail?id=" + this.form.infoId;
        }
        this.closeView("/proManagement/storage/projectStorageInfo/historyDetail", toPath, 0)
      }
    }
  };
</script>
