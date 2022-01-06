<template>
  <div class="app-container">
    <div class="header">
      <el-button
        type="primary"
        @click="backPage">返回
      </el-button>
      <el-button
        v-if="form.auditStatus === 1"
        v-hasPermi="['achie:achieCooperationIntention:edit']"
        type="success"
        @click="submitConfirm(1)">同意
      </el-button>
      <el-button
        v-if="form.auditStatus === 1"
        v-hasPermi="['achie:achieCooperationIntention:edit']"
        type="warning"
        @click="submitConfirm(2)">拒绝
      </el-button>
    </div>
    <div class="top-part">
      <el-card class="box-card">
        <div class="box-card-content">
          <el-row>
            <el-col :span="24">
              <span class="title-text">申请合作单位信息</span>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="5">
              <span>单位名称:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ form.applyUnit }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>联系人:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ form.linkman }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>联系电话:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ form.tel }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>邮箱:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ form.email }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div style="font-size: 80px; color: #11A983" class="el-icon-caret-right"></div>
      <el-card class="box-card">
        <div class="box-card-content">
          <el-row>
            <el-col :span="24">
              <span class="title-text">成果所属单位信息</span>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="5">
              <span>单位名称:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ achieUnit }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>联系人:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ achieLinkman }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>联系电话:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ achieTel }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span>邮箱:</span>
            </el-col>
            <el-col :span="18">
              <span>{{ achieEmail }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="center-part">
      <el-card class="box-card">
        <span class="title-text">申请合作单位留言</span>
        <div class="message">
          {{form.leaveMessage}}
        </div>
      </el-card>
    </div>
    <div class="bottom-part">
      <el-collapse>
        <el-collapse-item style="min-height: 600px">
          <template slot="title">
           <span class="title-text addClass">{{achieName}}</span>
          </template>
          <div>
            <iframe v-if="submitPdfFilePaths" :src="submitPdfFilePaths" frameborder="0"
                    style="width: 100%;height: calc(100vh - 170px);"></iframe>
          </div>
          <div>
            <div class="detail-hint" style="padding-top: 20px;" v-if="selDeclareScience">附件</div>
            <table class="detail-table" v-if="selDeclareScience">
              <tr>
                <td>知识产权证明</td>
                <td>
                  <upload v-model="selDeclareScience.prove1FilePaths" :edit="false"/>
                </td>
              </tr>
              <tr>
                <td>应用证明</td>
                <td>
                  <upload v-model="selDeclareScience.prove2FilePaths" :edit="false"/>
                </td>
              </tr>
              <tr>
                <td>技术评价证明</td>
                <td>
                  <upload v-model="selDeclareScience.prove3FilePaths" :edit="false"/>
                </td>
              </tr>
              <tr>
                <td>其他证明</td>
                <td>
                  <upload v-model="selDeclareScience.prove4FilePaths" :edit="false"/>
                </td>
              </tr>
            </table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import {getAchieCooperationIntention, updateAchieCooperationIntention} from "@/api/achie/achieCooperationIntention";

export default {
  name: "audit",
  data() {
    return {
      form: {},
      id: null,
      auditFlag: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getCooperationInfo(this.id)
    }
    if (this.$route.query.auditFlag) {
      this.auditFlag = this.$route.query.auditFlag
    }
  },
  computed: {
    submitPdfFilePaths() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.selDeclareInfo && this.form.displayInfo.selDeclareInfo.submitPdfFilePaths) {
        return this.form.displayInfo.selDeclareInfo.submitPdfFilePaths
      } else {
        return ''
      }
    },
    selDeclareScience() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.selDeclareInfo && this.form.displayInfo.selDeclareInfo.selDeclareScience) {
        return this.form.displayInfo.selDeclareInfo.selDeclareScience
      } else {
        return ''
      }
    },
    achieName() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.achieName) {
        return this.form.displayInfo.achieName
      } else {
        return '暂无成果名称'
      }
    },
    achieUnit() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.achieUnit && this.form.auditStatus === 2) {
        return this.form.displayInfo.achieUnit
      } else {
        return '*********'
      }
    },
    achieLinkman() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.linkman && this.form.auditStatus === 2) {
        return this.form.displayInfo.linkman
      } else {
        return '*********'
      }
    },
    achieTel() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.tel && this.form.auditStatus === 2) {
        return this.form.displayInfo.tel
      } else {
        return '*********'
      }
    },
    achieEmail() {
      if (this.form && this.form.displayInfo && this.form.displayInfo.email && this.form.auditStatus === 2) {
        return this.form.displayInfo.email
      } else {
        return '*********'
      }
    }
  },
  methods: {
    //获取合作信息
    getCooperationInfo(id) {
      getAchieCooperationIntention(id).then(({data}) => {
        this.form = data
      })
    },
    //返回
    backPage() {
      if (this.auditFlag === '1') {
        this.closeView('/achievement/cooperation/audit', '/achievement/cooperation', 0)
      } else {
        this.closeView('/achievement/cooperation/detail', '/achievement/cooperation', 0)
      }
    },
    //提交按钮
    submitConfirm(type) {
      if (type === 1) { // 同意
        this.agreeCooperation()
      } else {  //拒绝
        this.rejectCooperation()
      }
    },
    //同意
    agreeCooperation() {
      this.$confirm('是否同意该合作申请?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return updateAchieCooperationIntention({
          id: this.id,
          auditStatus: 2
        });
      }).then(() => {
        this.msgSuccess("已同意合作！");
        this.backPage()
      }).catch(() => {
      });
    },
    //拒绝
    rejectCooperation() {
      this.$confirm('是否拒绝该合作申请?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return updateAchieCooperationIntention({
          id: this.id,
          auditStatus: 3
        });
      }).then(() => {
        this.msgSuccess("已拒绝合作！");
        this.backPage()
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .top-part {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 20px 0;
    .box-card {
      width: 40%;
      .box-card-content {
        font-size: 18px;
        color: #333;
        .el-row {
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .center-part {
    width: 86.7%;
    display: flex;
    flex-direction: column;
    .message {
      margin-top: 20px;
      font-size: 16px;
      color: #333;
      min-height: 200px;
      text-indent: 32px;
    }
  }
  .bottom-part {
    width: 86.7%;
    margin-top: 20px;
    .addClass {
      width: 100%;
      text-align: center;
      cursor: pointer;
      margin-top: 20px;
    }
  }
  .title-text {
    font-size: 22px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
