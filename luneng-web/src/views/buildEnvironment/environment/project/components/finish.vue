<template>
  <div class="scroll-table">
    <table class="pdf-show-table tc">
      <thead>
        <tr>
          <th>环境影响报告批复文书</th>
          <th>网上备案信息</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <upload-btns :filePaths="form.threeOneFilePaths" :edit="!form.fileStatus && form.projectStatus >= 3" @click="uploadBtnsClick('threeOne', form.id, $event, '环境影响报告批复文书')" />
          </td>
          <td>
            <el-button v-hasPermi="['hb:hbProjectInfo:edit']" v-if="!form.baCode && !form.baDate && !form.baFilePaths" :disabled="!!form.fileStatus || !(form.projectStatus >= 3)" type="text" @click="handleFiling">上传</el-button>
            <template v-if="form.baCode || form.baDate || form.baFilePaths">
              <el-button v-hasPermi="['hb:hbProjectInfo:edit']" v-if="!form.fileStatus" type="text" @click="handleFiling">更新</el-button>
              <el-button  type="text" @click="handleFiling('view')">查看</el-button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <filing-dialog v-model="filingForm" :open.sync="filingOpen" :edit="filingEdit" @success="handleSuccess" />
    <upload-dialog :type="fileType" :id="form.id" :open.sync="open" :edit="!form.fileStatus" :title="title" @success="handleSuccess" />
  </div>
</template>

<script>
  import { updateHbProjectInfo } from "@/api/hb/hbProjectInfo";
  import filingDialog from '../../components/filingDialog';
  import uploadDialog from '../../components/uploadDialog';
  import uploadBtns from '../../components/uploadBtns';
  export default {
    components: {
      filingDialog, uploadDialog, uploadBtns
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
        filingForm: {},
        filingEdit: true,
        filingOpen: false,
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
          const path = `/buildEnvironment/environment/finish/fileDetail`;
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType: type,
              pageType: 'finish',
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
      },
      //备案
      handleFiling(event) {
        if (event == 'view') {
          this.filingEdit = false;
        } else {
          this.filingEdit = true;
        }
        this.filingOpen = true;
        this.filingForm = JSON.parse(JSON.stringify(this.form));
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
