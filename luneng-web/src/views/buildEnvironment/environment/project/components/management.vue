<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>环保工作组会签表</th>
          <th>年度计划</th>
          <th>工作简报</th>
          <th>项目周报</th>
          <th style="min-width: 146px;">环保问题整改记录</th>
          <th>自查</th>
          <th>督查</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.sevenFirstFilePaths" :edit="!form.fileStatus" @click="uploadBtnsClick('sevenFirst', form.id, $event, '环保工作组会签表')" />
          </td>
          <td>
            <el-button type="text" @click="routerToWork(1)">年度计划</el-button>
          </td>
          <td>
            <el-button type="text" @click="routerToWork(2)">工作简报</el-button>
          </td>
          <td>
            <el-button type="text" @click="routerToWork(3)">项目周报</el-button>
          </td>
          <td>
            <el-button type="text" @click="routerTo(1)">记录</el-button>
          </td>
          <td>
            <el-button type="text" @click="routerTo(2)">记录</el-button>
          </td>
          <td>
            <el-button type="text" @click="routerTo(3, 'dc')">记录</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <upload-dialog :type="fileType" :id="form.id" :open.sync="open" :edit="!form.fileStatus" :title="title" @success="handleSuccess" />
  </div>
</template>

<script>
  import { updateHbProjectInfo } from "@/api/hb/hbProjectInfo";
  import uploadDialog from '../../components/uploadDialog';
  import uploadBtns from '../../components/uploadBtns';
  export default {
    components: {
      uploadDialog, uploadBtns
    },
    props: {
      value: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        form: {},
        limit: 100,
        open: false,
        title: '附件',
        fileType: ''
      }
    },
    created() {
      this.form = this.value;
    },
    methods: {
      handleSuccess() {
        this.$emit('success');
      },
      //上传
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const path = `/buildEnvironment/environment/management/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'management',
              detail: true
            }
          })
        } else {
          this.fileType = type;
          if(title) this.title = title;
          this.open = true;
        }
      },
      routerToWork(reportType) {
        let path = '';
        if(reportType == 1) path = '/buildEnvironment/environment/management/report/year';
        if(reportType == 2) path = '/buildEnvironment/environment/management/report/month';
        if(reportType == 3) path = '/buildEnvironment/environment/management/report/week';
        let query = {
          infoId: this.form.id,
          reportType: reportType
        }
        this.$router.push({
          path: path,
          query: query
        })
      },
      routerTo(recordType, pageType) {
        let path = '';
        if (recordType == 1) path = '/buildEnvironment/environment/management/record';
        if (recordType == 2) path = '/buildEnvironment/environment/management/zc';
        if (recordType == 3) path = '/buildEnvironment/environment/management/dc';
        let query = {
          infoId: this.form.id,
          recordType: recordType
        }
        if (pageType) query.pageType = pageType;
        this.$router.push({
          path: path,
          query: query
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.id != undefined) {
          updateHbProjectInfo(this.form).then(response => {
            if (response.code === 200) {
              // this.msgSuccess("修改成功");
            }
          });
        }
      }
    },
    watch: {
      value(newVal) {
        this.form = newVal;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
