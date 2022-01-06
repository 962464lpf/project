<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>环境影响评价委托书</th>
          <th>环境影响报告计划书</th>
          <th>环境影响报告</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.twoFirstFilePaths" :edit="!form.fileStatus && form.projectStatus >= 2" @click="uploadBtnsClick('twoFirst', form.id, $event, '环境影响评价委托书')" />
          </td>
          <td>
            <upload-btns :filePaths="form.twoSecondFilePaths" :edit="!form.fileStatus && form.projectStatus >= 2" @click="uploadBtnsClick('twoSecond', form.id, $event, '环境影响报告计划书')" />
          </td>
          <td>
            <upload-btns :filePaths="form.twoThirdFilePaths" :edit="!form.fileStatus && form.projectStatus >= 2" @click="uploadBtnsClick('twoThird', form.id, $event, '环境影响报告')" />
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
          const path = `/buildEnvironment/environment/start/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'start',
              detail: true
            }
          })
        } else {
          this.fileType = type;
          if(title) this.title = title;
          this.open = true;
        }
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
