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
    <PdfView :src="form.feasibleUrl" />
  </div>
</template>

<script>
  import {getProjectStorageInfo, listProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import {listProjectStorageAdvice} from "@/api/storage/projectStorageAdvice";
  import {operation} from "@/api/storage/audit";
  import {listOperLog} from "@/api/storage/operLog";
  import PdfView from "@/components/PdfView";
  import proposalContent from '../projectStorageInfo/proposal/index';
  import reportDetail from '../projectStorageInfo/report-detail';

  export default {
    name: "proManagement-storage-audit-report",
    components: {
      PdfView, proposalContent, reportDetail
    },
    data() {
      return {
        // 表单参数
        form: {},
        src: '',
        detail: false,

        declareStatus: undefined,
        // 操作日志查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        //操作日志总数
        total: 0,
        // 历史版本总条数
        historyTotal: 0,
        // 历史版本查询条件
        historyQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        //操作日志列表
        logList: [],
        // 历史版本
        historyVersions: [],
        activeName: '操作日志',
        tabIndex: '1',
        proposalForm: {}
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      }
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        getProjectStorageInfo(id).then(response => {
          this.form = response.data;
        });
      },
      /** 返回 */
      handleBack() {
        let path = "/proManagement/storage/audit"
        this.$router.push({"path": path})
      }
    }
  };
</script>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>
