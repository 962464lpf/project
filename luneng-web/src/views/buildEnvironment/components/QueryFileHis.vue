<template>
  <div class="query-file-his">
    <div class="header">
      <div class="option-btn">
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="backPage">返回
        </el-button>
      </div>
      <div class="pro-name">
        <span v-if="fileInfo.projectName">{{fileInfo.projectName}}</span>
        <div class="pro-name-subtitle">
          <span v-if="fileInfo.createByName">{{ fileInfo.createByName + ' 上传于 ' }}</span>
          <span v-if="fileInfo.createTime">{{ fileInfo.createTime | fileCreateTime }}</span>
        </div>
      </div>
    </div>
    <div class="main">
      <upload
        :edit="false"
        v-model="fileInfo.filePath"
      />
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="历史版本" name="0">
          <div class="table-data">
            <el-table
              ref="table"
              :data="fileInfoHis">
              <el-table-column
                label="序号"
                align="center"
                type="index">
                <template slot-scope="scope">
                  <span>{{ (pageObj.pageNum - 1) * pageObj.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="文件名"
                align="center"
                prop="filePath"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <upload
                    style="text-align: center"
                    :edit="false"
                    v-model="scope.row.filePath"/>
                </template>
              </el-table-column>
              <el-table-column
                label="上传人"
                align="center"
                prop="createByName"
                show-overflow-tooltip />
              <el-table-column
                label="上传时间"
                align="center"
                prop="createTime"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "QueryFileHis",
  props: {
    //传入当前查看文件信息
    fileInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    //传入当前查看文件历史版本列表
    fileInfoHis: {
      type: Array,
      default() {
        return []
      }
    },
    //传入当前查看文件历史版本列表页码以及页数
    pageObj: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      activeName: '0'
    }
  },
  filters: {
    fileCreateTime(value) {
      if (value) {
        return value.toString().substr(0, 10)
      }
    }
  },
  methods: {
    //返回
    backPage() {
      this.$emit('back-page')
    }
  }
}
</script>

<style lang="scss" scoped>
.query-file-his {
  width: 100%;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .option-btn {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
    }
    .pro-name {
      width: 100%;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      font-weight: bold;
      .pro-name-subtitle {
        margin-top: 20px;
        font-size: 18px;
        color: #666;
      }
    }
  }
  .main {
    width: 100%;
    margin: 20px 0;
  }
  .footer {
    width: 100%;
  }
}
</style>
