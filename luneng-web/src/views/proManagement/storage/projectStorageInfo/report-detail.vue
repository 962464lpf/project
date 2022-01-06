<template>
  <div>
<!--    <PdfView :src="form.feasibleUrl" v-if="!edit"/>-->
    <table
      v-if="feasibleForm&&(feasibleForm.leadershipOpinionUrl || feasibleForm.engineeringUnitUrl || feasibleForm.selfRaisedUrl || feasibleForm.cooperativeUnitUrl)"
      class="pdf-show-table" style="margin-top: 20px;">
      <tr>
        <td align="center" colspan="2">证明文件</td>
      </tr>
      <tr v-if="feasibleForm.leadershipOpinionUrl">
        <td style="width: 300px;">各承担单位业务主管对项目的意见</td>
        <td>
          <upload accept=".pdf" v-model="feasibleForm.leadershipOpinionUrl" @change="submitForm" @remove="submitForm" :edit="edit"/>
        </td>
      </tr>
      <tr v-if="feasibleForm.engineeringUnitUrl">
        <td style="width: 300px;">依托工程单位对项目的意见</td>
        <td>
          <upload accept=".pdf" v-model="feasibleForm.engineeringUnitUrl" @change="submitForm" @remove="submitForm" :edit="edit"/>
        </td>
      </tr>
      <tr v-if="feasibleForm.selfRaisedUrl">
        <td style="width: 300px;">自筹经费来源及保证证明</td>
        <td>
          <upload accept=".pdf" v-model="feasibleForm.selfRaisedUrl" @change="submitForm" @remove="submitForm" :edit="edit"/>
        </td>
      </tr>
      <tr v-if="feasibleForm.cooperativeUnitUrl">
        <td style="width: 300px;">协作单位意见及盖章</td>
        <td>
          <upload accept=".pdf" v-model="feasibleForm.cooperativeUnitUrl" @change="submitForm" @remove="submitForm" :edit="edit"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import {getProjectStorageFeasibleByInfoId, updateProjectStorageFeasible} from "@/api/storage/projectStorageFeasible";
  import PdfView from "@/components/PdfView";

  export default {
    components: {
      PdfView
    },
    data() {
      return {
        // 表单参数
        form: {},
        feasibleForm: {}
      };
    },
    props: {
      value: {
        default: ''
      },
      edit: {
        default: true
      }
    },
    created() {
      this.form = this.value;
      this.init();
    },
    methods: {
      init() {
        if (this.form.id) {
          getProjectStorageFeasibleByInfoId(this.form.id).then(res => {
            this.feasibleForm = res.data;
          })
        }
      },
      /** 提交按钮 */
      submitForm: function () {
        if (this.feasibleForm.id != undefined) {
          updateProjectStorageFeasible(this.feasibleForm);
        }
      }
    },
    watch: {
      value(newVal, oldVal) {
        this.form = newVal;
        this.init();
      }
    }
  };
</script>
