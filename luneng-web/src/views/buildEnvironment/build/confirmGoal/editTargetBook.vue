<template>
  <div class="app-container">
    <div class="main">
      <div class="book-name">绿色建筑认证目标建议书</div>
      <table class="pdf-show-table tc">
        <tr>
          <td style="width: 70px;min-height: 80px; font-weight: bold">项目名称</td>
          <td colspan="4">{{proInfo.projectName}}</td>
          <td style="width: 70px;min-height: 80px; font-weight: bold">设计单位</td>
          <td colspan="4">{{proInfo.designUnit}}</td>
        </tr>
        <tr>
          <td style="font-weight: bold">项目地点</td>
          <td colspan="9">{{proInfo.projectAddr}}</td>
        </tr>
        <tr>
          <td colspan="10">
            <el-input
              type="textarea"
              :rows="4"
              v-model="proInfo.remark"
              placeholder="请输入内容"
              show-word-limit
              maxlength="200"
            />
          </td>
        </tr>
        <tr>
          <td colspan="10">
            <div class="sign-box">
              <div class="sign-box-name">绿色建筑小组签名：</div>
              <table class="pdf-show-table tc">
                <tr style="font-weight: bold">
                  <td style="width: 130px;">岗位</td>
                  <td>姓名</td>
                  <td>签字</td>
                  <td>备注</td>
                </tr>
                <tr v-for="item in proInfo.buildPersonList">
                  <td style="font-weight: bold; width: 180px">{{ selectDictLabel(buildPersonOptions, item.type) }}</td>
                  <td>
                    <el-input v-model="item.personName" placeholder="请输入姓名" maxlength="10"/>
                  </td>
                  <td style="width: 180px"></td>
                  <td>
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="item.remark"
                      placeholder="请输入内容"
                      show-word-limit
                      maxlength="30"
                    />
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
      <div class="remark-text">备注：除签字栏外，其余均为打印，签至总经理后将扫描件传至集团科信部与集团设计部备案，原件项目公司留存。</div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm">提 交</el-button>
      <el-button type="primary" @click="saveForm">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {getAdviseInfo, getBuildInfo, preview, updateAdviseInfo} from "@/api/build/buildInfo";

export default {
  name: "editTargetBook",
  data() {
    return {
      ddd: '',
      //项目id
      id: null,
      proDetailFlag: null,
      tabActiveName: null,
      proInfo: {},
      buildPersonOptions: []
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.init(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    this.getDicts("build_person_type").then(response => {
      this.buildPersonOptions = response.data;
    });
  },
  methods: {
    //获取初始化的数据
    init(infoId) {
      getAdviseInfo(infoId).then(({data}) => {
        this.proInfo = data
      })
    },
    saveForm() {
      const adviseInfo = {
        type: 2,
        buildInfo: JSON.stringify(this.proInfo)
      }
      updateAdviseInfo(adviseInfo).then(() => {
        this.msgSuccess('保存成功')
        preview(this.id).then(() => {})
        if (this.proDetailFlag) {
          this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
        } else {
          this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/confirmGoal", 0)
        }
      })
    },
    submitForm() {
      const adviseInfo = {
        type: 1,
        buildInfo: JSON.stringify(this.proInfo)
      }
      updateAdviseInfo(adviseInfo).then(() => {
        preview(this.id).then(() => {})
        this.msgSuccess('提交成功')
        if (this.proDetailFlag) {
          this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
        } else {
          this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/confirmGoal", 0)
        }
      })
    },
    cancel() {
      if (this.proDetailFlag) {
        this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/buildProject/buildProDetail?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/buildEnvironment/build/confirmGoal/editTargetBook", "/buildEnvironment/build/confirmGoal", 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 140px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  .main {
    width: 80%;
    padding: 30px 40px;
    border: 1px solid #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    .book-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 50px;
    }
    .sign-box {
      width: 100%;
      padding: 5px 2px;
      .sign-box-name {
        display: flex;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    .remark-text {
      font-size: 16px;
      margin-top: 10px;
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    padding: 10px 38.5% 10px 40.5%;
    left: 0;
    right: 0;
    bottom: 38px;
    display: flex;
    justify-content: space-between;
    background-color: #fff
  }
}
</style>
