<template>
  <div style="padding: 20px 0;">
    <el-button
      type="primary"
      @click="exportPdf"
    >{{btnText}}
    </el-button>
    <div v-if="hint" class="el-upload__tip red-hint">请将本页生成PDF打印，签字盖章后再将本页扫描件上传</div>
    <el-dialog title="预览" :visible.sync="open" append-to-body :close-on-click-modal="false">
      <div ref="pdfLoading">
        <iframe :src="pdfFile" frameborder="0" style="width: 100%;height: calc(100vh - 170px);"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {pdfPreview} from "@/api/sel/selDeclareInfo";
  import {storagePreview} from "@/api/storage/projectStorageInfo"
  import {concludePreview} from "@/api/conclude/result"
  import {Loading} from 'element-ui';
  import {downLoadPreviewPlan} from "@/api/pro/proApprovalInfo";

  export default {
    data() {
      return {
        open: false,
        pdfFile: '',
        loading: null
      };
    },
    props: {
      value: {
        default: ''
      },
      page: {
        default: ''
      },
      id: {
        default: ''
      },
      type: {
        default: 'declare'
      },
      btnText: {
        default: '单页生成PDF'
      },
      hint: {
        default: true
      }
    },
    created() {

    },
    methods: {
      exportPdf() {
        this.pdfFile = '';
        if (this.loading) this.loading.close();
        this.open = true;
        setTimeout(() => {
          this.loading = Loading.service({target: this.$refs.pdfLoading});
        }, 20)
        let data = {id: this.id};
        let data2 = {
          id: this.id,
          action: 1,
          type: 1
        }
        if (this.page !== '') data.page = this.page;
        //declare 奖励申报
        if (this.type == 'declare') {
          pdfPreview(data).then(res => {
            this.pdfFile = res.msg;
            this.$nextTick(() => {
              this.loading.close();
            });
          })
        }
        if (this.type == "proImplement") {
          downLoadPreviewPlan(data2).then(res => {
            this.pdfFile = res.data;
            this.$nextTick(() => {
              this.loading.close();
            });
          })
        }
        if (this.type == "storage") {
          storagePreview(data).then(res => {
            this.pdfFile = res.msg;
            this.$nextTick(() => {
              this.loading.close();
            });
          })
        }
        if (this.type == "conclude") {
          // 申请结题
          concludePreview(data).then(res => {
            this.pdfFile = res.msg;
            this.$nextTick(() => {
              this.loading.close();
            });
          })
        }
      },
      cancel() {
        this.open = false;
        this.pdfFile = '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .red, .red-hint, .hint-text.red-hint {
    color: #EC808D;
  }
</style>
