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
      <div class="fr" v-if="!detail">
        <span style="font-size: 14px;margin-right: 10px;">设置等级</span>
        <el-select style="width: 140px" v-model="form.reviewResult" :disabled="form.levelFlag==1"
                   @change="resultChange(form)">
          <el-option
            v-for="dict in levelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </div>
    </el-row>
    <div class="detail-title">{{form.projectName}}</div>
    <div class="detail-hint">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime,
      '{y}-{m}-{d}')}}
    </div>
    <review-table :id="id" page="result" />
  </div>
</template>

<script>
  import {getProjectStorageInfo, updateProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import reviewTable from '../review/reviewTable';

  export default {
    name: "proManagement-storage-result-detail",
    components: {
      reviewTable
    },
    data() {
      return {
        // 表单参数
        form: {},
        detail: false,
        // 等级字典
        levelOptions: [],
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
      this.getDicts("project_storage_level").then(response => {
        this.levelOptions = response.data;
      });
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        if (this.$route.path == '/proManagement/storage/audit/detail') {
          this.detail = true;
        }
        getProjectStorageInfo(id).then(response => {
          this.form = response.data;
        });
      },
      /** 返回 */
      handleBack() {
        let path = "/proManagement/storage/result";
        this.$router.push({"path": path})
      },
      resultChange(row) {
        updateProjectStorageInfo(row).then(res => {
          if (res.code == 200) {
            this.msgSuccess('操作成功');
          }
        })
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
