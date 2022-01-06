<template>
  <div>
    <div class="add-bth">
      <el-button
        type="primary"
        v-hasPermi="['build:buildInfo:addOtherAuthentication']"
        @click="handleAdd">新增认证
      </el-button>
    </div>
    <el-table
      ref="table"
      :data="otherAuthentications">
      <el-table-column
        min-width="140"
        label="绿建标准"
        align="center"
        :formatter="criterionFormat"
        prop="criterion"
        />
      <el-table-column
        min-width="140"
        label="认证级别"
        align="center"
        :formatter="levelFormat"
        prop="level"
        />
      <el-table-column
        min-width="140"
        label="获取时间"
        align="center"
        prop="obtainDate"
        >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.obtainDate, '{y}-{m}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="认证资料"
        align="center"
        prop="filePath">
        <template slot-scope="scope">
          <upload-btns :edit="buildProForm.finish === 0" :filePaths="scope.row.filePath" @click="uploadBtnsClick(23, scope.row, $event, '认证资料')"/>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="操作"
        align="center"
        fixed="right"
        v-if="delOtherAuthentication">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['build:buildInfo:deleteOtherAuthentication']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <upload-file-dialog
      :id="currProId"
      :type="uploadFileType"
      :title="title"
      :open.sync="open"
      :limit="100"
      @success="getList"/>
    <el-dialog
      :visible.sync="open2"
      :title="title2"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div>
        <el-form ref="otherAuthenticationForm" :model="otherAuthenticationForm" :rules="otherAuthenticationRules" label-width="96px">
          <el-form-item label="绿建标准" prop="criterion">
            <el-select
              v-model="otherAuthenticationForm.criterion"
              placeholder="请选择绿建标准"
              style="width: 100%"
              @change="selLevelOptions">
              <el-option
                v-for="dict in criterionOptionsTem"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认证级别" prop="level">
            <el-select
              :disabled="!otherAuthenticationForm.criterion"
              v-model="otherAuthenticationForm.level"
              placeholder="请选择认证级别"
              style="width: 100%">
              <el-option
                v-for="dict in levelOptions2"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获取时间" prop="obtainDate">
            <el-date-picker
              clearable
              v-model="otherAuthenticationForm.obtainDate"
              type="month"
              style="width: 100%"
              placeholder="请选择获取认证时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="认证资料" prop="filePath">
            <upload v-if="open2" v-model="otherAuthenticationForm.filePath" :limit="100"/>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center">
          <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
          <el-button style="width: 100px" @click="cancelClose">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 权限 -->
    <div v-hasPermi="['build:buildInfo:deleteOtherAuthentication']" id="delOtherAuthentication"></div>
  </div>
</template>

<script>
import uploadBtns from '../../../components/uploadBtns';
import uploadFileDialog from '../../components/uploadFileDialog'
import {addOther, getBuildInfo, removeOther} from "@/api/build/buildInfo";

export default {
  name: "TabsBoxEight",
  props: {
    buildProForm: {
      type: Object,
      default() {
        return {}
      }
    },
    criterionOptions :{
      type: Array,
      default() {
        return []
      }
    },
    levelOptions :{
      type: Array,
      default() {
        return []
      }
    },
    proDetailFlag: {
      type: String,
      default: ''
    },
    tabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title2: '其他认证',
      open2: false,
      levelOptions2: [],
      weelOptions: [],
      leedOptions: [],
      criterionOptionsTem: [],
      otherAuthenticationForm: {
        infoId: null,
        criterion: null,
        level: null,
        obtainDate: null,
        filePath: null
      },
      otherAuthenticationRules: {
        criterion: [
          { required: true, message: "绿建标准不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "认证等级不能为空", trigger: "blur" }
        ],
        obtainDate: [
          { required: true, message: "获取时间不能为空", trigger: "blur" }
        ],
        filePath: [
          { required: true, message: "认证资料不能为空", trigger: "blur" }
        ]
      },
      otherAuthentications: [],
      currProId: null,
      uploadFileType: null,
      title: '',
      open: false,
      delOtherAuthentication: false
    }
  },
  created() {
    this.otherAuthentications = []
    this.otherAuthentications = this.buildProForm.otherAuthentications
    this.getDicts("leed_level").then(response => {
      this.leedOptions = response.data;
    })
    this.getDicts("weel_level").then(response => {
      this.weelOptions = response.data;
    })
  },
  mounted() {
    this.delOtherAuthentication = !!document.getElementById('delOtherAuthentication')
  },
  watch :{
    buildProForm(newValue) {
      this.otherAuthentications = []
      this.otherAuthentications = newValue.otherAuthentications
    },
    criterionOptions(newValue) {
      this.criterionOptionsTem = newValue.filter((item) => {
        return item.dictValue !== '1'
      })
    }
  },
  components: {
    uploadBtns,
    uploadFileDialog
  },
  methods: {
    // 绿建星级字典翻译
    levelFormat(row) {
      if (row.criterion === '1') {
        return this.selectDictLabel(this.levelOptions, row.level);
      } else if (row.criterion === '2') {
        return this.selectDictLabel(this.leedOptions, row.level);
      } else {
        return this.selectDictLabel(this.weelOptions, row.level);
      }
    },
    // 绿建星级字典翻译
    criterionFormat(row) {
      if (row.criterion) {
        return this.selectDictLabel(this.criterionOptionsTem, row.criterion);
      }
    },
    //新增认证
    handleAdd() {
      getBuildInfo(this.buildProForm.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            this.open2 = true
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //选择认证
    selLevelOptions(value) {
      if (value === '2') {
        this.getDicts("leed_level").then(response => {
          this.levelOptions2 = response.data;
          this.leedOptions = response.data;
        })
      } else if (value === '3') {
        this.getDicts("weel_level").then(response => {
          this.levelOptions2 = response.data;
          this.weelOptions = response.data;
        })
      }
    },
    //提交
    submitForm() {
      this.$refs["otherAuthenticationForm"].validate(valid => {
        if (valid) {
          this.otherAuthenticationForm.infoId = this.buildProForm.id
          addOther(this.otherAuthenticationForm).then(() => {
            this.msgSuccess("新增成功");
            this.getList()
            this.cancelClose()
          })
        }
      })
    },
    //取消
    cancelClose() {
      this.open2 = false
      this.$refs['otherAuthenticationForm'].resetFields()
    },
    //上传更新按钮
    uploadBtnsClick(fileType, row, event, title) {
      if (event === "view") {
        const id = row.id
        const path = '/buildEnvironment/build/buildProject/fileDetail'
        this.$router.push({
          'path': path,
          'query': {
            id,
            fileType,
            infoId: row.infoId,
            proDetailFlag: this.proDetailFlag,
            tabActiveName: this.tabActiveName
          }
        })
      } else {
        getBuildInfo(row.infoId).then(({data}) => {
          if (data.finish === 0) {
            if (data.approvalStatus === 4) {
              this.currProId = row.id
              this.uploadFileType = fileType
              if (title) this.title = title
              this.open = true
            } else {
              this.msgError('当前项目正在审核中或审核未通过，不可操作')
            }
          } else {
            this.msgError('当前项目已归档，不可操作')
          }
        })
      }
    },
    //删除认证
    handleDelete(row) {
      getBuildInfo(row.infoId).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            const ids = row.id || this.ids;
            this.$confirm('是否确认删除所选择的认证?', "系统提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function () {
              return removeOther(ids);
            }).then(() => {
              this.getList();
              this.msgSuccess("删除成功");
            }).catch(function () {
            });
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //上传成功刷新
    getList() {
      this.$emit('refresh-list')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-bth {
  padding: 10px 0 20px 0;
}
</style>
