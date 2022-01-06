<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回
        </el-button>
      </el-col>
    </el-row>
    <div class="detail-title">{{form.projectName}}</div>
    <div class="detail-hint">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime, '{y}-{m}-{d}')}}
    </div>
    <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
      <el-radio-button label="1">项目基本信息</el-radio-button>
      <el-radio-button v-show="form.submitType == '0'" label="2">项目建议书</el-radio-button>
      <el-radio-button label="3">项目可研报告</el-radio-button>
      <el-radio-button v-show="form.status" label="4">专家评审意见</el-radio-button>
    </el-radio-group>
    <el-form v-show="tabIndex === '1'" label-width="108px">
      <declareContent v-model="form" :edit="false"/>
    </el-form>
    <el-form v-if="tabIndex === '2'">
      <PdfView :src="form.adviceUrl"/>
    </el-form>
    <div v-if="tabIndex === '3'">
      <PdfView :src="form.feasibleUrl"/>
      <reportDetail v-model="form" :edit="false"/>
    </div>
    <review-table v-show="tabIndex === '4'" :id="id"/>
  </div>
</template>

<script>
  import {getProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import proposalContent from '../projectStorageInfo/proposal/index';
  import declareContent from '../projectStorageInfo/declare';
  import reviewTable from '../review/reviewTable';
  import PdfView from "@/components/PdfView";
  import reportDetail from '../projectStorageInfo/report-detail';

  export default {
    name: "proManagement-storage-library-detail",
    components: {
      proposalContent, declareContent, reviewTable, PdfView, reportDetail
    },
    data() {
      return {
        form: {},
        declareForm: {},
        proposalForm: {},
        tabIndex: '1'
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
        getProjectStorageInfo(this.id).then(res => {
          this.form = res.data;
          // if(this.form.submitType == '0') {
          //   listProjectStorageAdvice({
          //     infoId: this.id
          //   }).then(response => {
          //     if (response.rows.length > 0) {
          //       this.proposalForm = response.rows[0];
          //     }
          //   });
          // }
        })
      },
      /** 返回 */
      handleBack() {
        let path = "/proManagement/storage/library";
        let from = this.$route.query.from;
        if (from == 'result') {
          path = '/proManagement/storage/result';
        }
        this.closeView(this.$route.path, path, 0)
      }
    }
  };
</script>
