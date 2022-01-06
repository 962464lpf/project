<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>竣工环境保护验收申请表</th>
          <th>三同时验收登记表</th>
          <th>项目竣工环境保护验收监测表</th>
          <th>水保验收</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.eightFirstFilePaths" :edit="!form.fileStatus && form.projectStatus >= 7" @click="uploadBtnsClick('eightFirst', form.id, $event, '竣工环境保护验收申请表')" />
          </td>
          <td>
            <upload-btns :filePaths="form.eightSecondFilePaths" :edit="!form.fileStatus && form.projectStatus >= 7" @click="uploadBtnsClick('eightSecond', form.id, $event, '三同时验收登记表')" />
          </td>
          <td>
            <upload-btns :filePaths="form.eightThirdFilePaths" :edit="!form.fileStatus && form.projectStatus >= 7" @click="uploadBtnsClick('eightThird', form.id, $event, '项目竣工环境保护验收监测表')" />
          </td>
          <td>
            <upload-btns :filePaths="form.eightForthFilePaths" :edit="!form.fileStatus && form.projectStatus >= 7" @click="uploadBtnsClick('eightForth', form.id, $event, '水保验收')" />
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
      handleUpload(title) {
        this.open = true;
        this.title = title;
      },
      handleSuccess() {
        this.$emit('success');
      },
      //上传
      uploadBtnsClick(type, id, event, title) {
        if (event == 'view') {
          const path = `/buildEnvironment/environment/acceptanceCheck/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'acceptanceCheck',
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
