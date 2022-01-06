<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>环境施工保护方案</th>
          <th>应急预案</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.fourFirstFilePaths" :edit="!form.fileStatus && form.projectStatus >= 4" @click="uploadBtnsClick('fourFirst', form.id, $event, '环境施工保护方案')" />
          </td>
          <td>
            <upload-btns :filePaths="form.fourSecondFilePaths" :edit="!form.fileStatus && form.projectStatus >= 4" @click="uploadBtnsClick('fourSecond', form.id, $event, '应急预案')" />
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
          const path = `/buildEnvironment/environment/emergency/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'emergency',
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
