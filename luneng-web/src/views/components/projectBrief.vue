<template>
  <div class="tab1-box">
    <el-form
      ref="decProjForm">
      <table class="proj-table">
        <tr>
          <td>项目名称</td>
          <td>
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="projectName2" style="margin: 0;">
                <el-input
                  v-model="decProjForm.projectName2"
                  type="text"
                  placeholder="请输入项目名称" disabled/>
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.projectName2}}</span>
            </div>
          </td>
          <td><span v-if="topBoxType != '标题'" class="red-star">*</span>完成单位</td>
          <td>
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="mainUnits2" style="margin: 0;">
                <el-input
                  v-model="decProjForm.mainUnits2"
                  type="text"
                  placeholder="请输入完成单位"/>
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.mainUnits2}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td><span v-if="topBoxType != '标题'" class="red-star">*</span>主要完成人</td>
          <td colspan="3">
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="mainPersons2" style="margin: 0;">
                <el-input
                  v-model="decProjForm.mainPersons2"
                  type="text"
                  placeholder="请输入主要完成人"/>
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.mainPersons2}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td><span v-if="topBoxType != '标题'" class="red-star">*</span>项目简介及创新点</td>
          <td colspan="3">
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="projectText1" style="margin: 0;">
                <el-input
                  type="textarea"
                  :rows="8"
                  placeholder="请填写项目简介及创新点，字数不超过500"
                  maxlength="500"
                  show-word-limit
                  v-model="decProjForm.projectText1"
                  />
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.projectText1}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td><span v-if="topBoxType != '标题'" class="red-star">*</span>已获奖励及知识产权</td>
          <td colspan="3">
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="projectText2" style="margin: 0">
                <el-input
                  type="textarea"
                  :rows="8"
                  placeholder="请填写已获奖励及知识产权，字数不超过150"
                  maxlength="150"
                  show-word-limit
                  v-model="decProjForm.projectText2"
                  />
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.projectText2}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td><span v-if="topBoxType != '标题'" class="red-star">*</span>应用情况及经济效益</td>
          <td colspan="3">
            <div v-if="topBoxType != '标题'">
              <el-form-item prop="projectText3" style="margin: 0">
                <el-input
                  type="textarea"
                  :rows="8"
                  placeholder="请填写应用情况及经济效益，字数不超过300"
                  maxlength="300"
                  show-word-limit
                  v-model="decProjForm.projectText3"
                  />
              </el-form-item>
            </div>
            <div v-else>
              <span>{{form.projectText3}}</span>
            </div>
          </td>
        </tr>
      </table>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: 'ProjectBrief',
    props: {
      form: {
        default: {}
      }
    },
    data() {
      return {
        topBoxType: '标题',
        //申报项目信息
        declareInfo: {},
        //申报奖项字典
        decRewardOptions: [],
        //产业类别
        industryTypeOptions: [],
        decProjForm: {}
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .tab1-box {
    width: 100%;

    .proj-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      color: #606266;
      font-size: 14px;
      line-height: 20px;
      table-layout: fixed;

      tr:nth-child(n+3) td {
        height: 200px;
      }

      td {
        border: 1px solid #E6E9F0;
        padding: 20px 15px;
        word-wrap: break-word;

        .ppt-box {
          width: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          span {
            margin-top: 10px;
          }
        }
      }

      tr td:nth-child(2n+1) {
        text-align: center;
        width: 200px;
      }
    }
  }

  .tab2-box {
    width: 100%;

    .proj-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      color: #606266;
      font-size: 14px;
      line-height: 20px;
      table-layout: fixed;

      td {
        border: 1px solid #E6E9F0;
        padding: 15px 10px;
        word-wrap: break-word;
        text-align: center;
      }
    }

    .title-box {
      width: 70%;
      display: flex;
      flex-direction: column;
      margin-top: 10px;

      .top {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;

        .top-bottom {
          margin-top: 20px;
          display: flex;
          flex-direction: column;

          span {
            margin-bottom: 10px;
          }
        }
      }

      .bottom {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;

        .titleText {

        }
      }
    }
  }

  .red-star {
    color: red;
    margin-right: 4px;
  }
</style>
