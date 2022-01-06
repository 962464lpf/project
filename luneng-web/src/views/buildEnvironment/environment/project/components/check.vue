<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>编制单位委托书</th>
          <th>竣工环境保护验收报告</th>
          <th>竣工环境保护验收报告计划书</th>
          <th>竣工环境保护验收监测报告表</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.fiveFirstFilePaths" :edit="!form.fileStatus && form.projectStatus >= 5" @click="uploadBtnsClick('fiveFirst', form.id, $event, '编制单位委托书')" />
          </td>
          <td>
            <upload-btns :filePaths="form.fiveSecondFilePaths" :edit="!form.fileStatus && form.projectStatus >= 5" @click="uploadBtnsClick('fiveSecond', form.id, $event, '竣工环境保护验收报告')" />
          </td>
          <td>
            <upload-btns :filePaths="form.fiveThirdFilePaths" :edit="!form.fileStatus && form.projectStatus >= 5" @click="uploadBtnsClick('fiveThird', form.id, $event, '竣工环境保护验收报告计划书')" />
          </td>
          <td>
            <upload-btns :filePaths="form.fiveForthFilePaths" :edit="!form.fileStatus && form.projectStatus >= 5" @click="uploadBtnsClick('fiveForth', form.id, $event, '竣工环境保护验收监测报告表')" />
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
          const path = `/buildEnvironment/environment/check/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'check',
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
