<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <div class="pro-name-text" v-if="buildProForm.projectName">{{ buildProForm.projectName }}</div>
        <div>
          <el-row :gutter="15">
            <el-col :span="1.5">
              <el-button
                v-show="buildProForm.finish === 0"
                type="warning"
                @click="handleUpdate(buildProForm)"
                v-hasPermi="['build:buildInfo:superEdit']"
              >修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-show="buildProForm.approvalStatus !== 3 && buildProForm.approvalStatus !== 4"
                type="danger"
                @click="handleDelete(buildProForm)"
                v-hasPermi="['build:buildInfo:remove']"
              >删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                @click="handleBack">返回
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left-box">
        <el-tabs tab-position="left" v-model="tabActiveName" @tab-click="tabChange">
          <el-tab-pane
            :label="item.label"
            :name="item.value"
            v-for="item in tabsInfoList"
            :key="item.value">
          </el-tab-pane>
        </el-tabs>
      </div>
      <b-scroll
        class="wrapper"
        ref="scroll"
        @bscroll="bScroll"
        :probe-type='3'>
        <div class="tabs-name" ref="tabsName1">
          <span>基本信息</span>
          <tabs-box-one
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName2">
          <span>确定认证目标</span>
          <tabs-box-two
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :approval-status-options="approvalStatusOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName3">
          <span>绿建评价认证</span>
          <tabs-box-three
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName4">
          <span>绿建施工配合</span>
          <tabs-box-four
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName5">
          <span>竣工资料整理</span>
          <tabs-box-five
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName6">
          <span>绿建资料备案</span>
          <tabs-box-six
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName7">
          <span>运营跟踪管理</span>
          <tabs-box-seven
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="tabs-name" ref="tabsName8">
          <span>其他认证</span>
          <tabs-box-eight
            :build-pro-form="buildProForm"
            :criterion-options="criterionOptions"
            :level-options="levelOptions"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refresh-list="refreshList"
          />
        </div>
        <div class="lastDiv" ref="lastDiv"></div>
      </b-scroll>
    </div>
  </div>
</template>

<script>
import BScroll from '@/components/BScroll'
import TabsBoxOne from "./childCom/TabsBoxOne";
import TabsBoxTwo from "./childCom/TabsBoxTwo";
import TabsBoxThree from "./childCom/TabsBoxThree";
import TabsBoxFour from "./childCom/TabsBoxFour";
import TabsBoxFive from "./childCom/TabsBoxFive";
import TabsBoxSix from "./childCom/TabsBoxSix";
import TabsBoxSeven from "./childCom/TabsBoxSeven";
import TabsBoxEight from "./childCom/TabsBoxEight";

import {delBuildInfo, getBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "buildProDetail",
  data() {
    return {
      tabActiveName: '1',
      tabsInfoList: [
        {
          value: '1',
          label: '基本信息'
        },
        {
          value: '2',
          label: '确定认证目标'
        },
        {
          value: '3',
          label: '绿建评价认证'
        },
        {
          value: '4',
          label: '绿建施工配合'
        },
        {
          value: '5',
          label: '竣工资料整理'
        },
        {
          value: '6',
          label: '绿建资料备案'
        },
        {
          value: '7',
          label: '运营跟踪管理'
        },
        {
          value: '8',
          label: '其他认证'
        }
      ],
      buildProForm: {},
      criterionOptions: [],
      approvalStatusOptions: [],
      levelOptions: [],
      id: null
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getProInfo(this.id)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    //获取字典数据
    this.getDicts("build_criterion").then(response => {
      this.criterionOptions = response.data;
    });
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
    this.getDicts("build_approval_status").then(response => {
      this.approvalStatusOptions = response.data;
    });
  },
  components: {
    BScroll,
    TabsBoxOne,
    TabsBoxTwo,
    TabsBoxThree,
    TabsBoxFour,
    TabsBoxFive,
    TabsBoxSix,
    TabsBoxSeven,
    TabsBoxEight
  },
  methods: {
    //获取项目信息
    getProInfo(id) {
      getBuildInfo(id).then(({data}) => {
        data.showAuthenticationDate = !!data.authenticationDate;
        this.buildProForm = data
        this.refreshBScroll()
      })
    },
    //普通修改
    handleUpdate(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const id = row.id
          const path = '/buildEnvironment/build/buildProject/editProInfo'
          this.$router.push({
            'path': path,
            'query': {
              id,
              proDetailFlag: this.proDetailFlag,
              tabActiveName: this.tabActiveName
            }
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //删除
    handleDelete(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const ids = row.id;
          this.$confirm('是否确认删除当前的绿色建筑项目?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            return delBuildInfo(ids);
          }).then(() => {
            this.handleBack()
            this.msgSuccess("删除成功");
          }).catch(function () {
          });
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },

    refreshList() {
      this.getProInfo(this.id)
    },
    //监听滚动事件
    bScroll(position) {
      if (-position.y >= this.$refs.tabsName8.offsetTop) {
        this.tabActiveName = '8'
      } else if (-position.y >= this.$refs.tabsName7.offsetTop) {
        this.tabActiveName = '7'
      } else if (-position.y >= this.$refs.tabsName6.offsetTop) {
        this.tabActiveName = '6'
      } else if (-position.y >= this.$refs.tabsName5.offsetTop) {
        this.tabActiveName = '5'
      } else if (-position.y >= this.$refs.tabsName4.offsetTop) {
        this.tabActiveName = '4'
      } else if (-position.y >= this.$refs.tabsName3.offsetTop) {
        this.tabActiveName = '3'
      } else if (-position.y >= this.$refs.tabsName2.offsetTop) {
        this.tabActiveName = '2'
      } else {
        this.tabActiveName = '1'
      }
    },
    //切换滚动
    tabChange(value) {
      switch (value.name) {
        case '1':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName1.offsetTop)
          break;
        case '2':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName2.offsetTop)
          break;
        case '3':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName3.offsetTop)
          break;
        case '4':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName4.offsetTop)
          break;
        case '5':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName5.offsetTop)
          break;
        case '6':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName6.offsetTop)
          break;
        case '7':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName7.offsetTop)
          break;
        case '8':
          this.$refs.scroll.scrollTo(0, -this.$refs.tabsName8.offsetTop)
          break;
      }
    },
    handleBack() {
      if (this.proDetailFlag === '1') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/buildProject", 0)
      } else if (this.proDetailFlag === '2') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/confirmGoal", 0)
      } else if (this.proDetailFlag === '3') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/reviewGoal", 0)
      } else if (this.proDetailFlag === '4') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/assessApprove", 0)
      } else if (this.proDetailFlag === '5') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/construction", 0)
      } else if (this.proDetailFlag === '6') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/completedFile", 0)
      } else if (this.proDetailFlag === '7') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/fileRecord", 0)
      } else if (this.proDetailFlag === '8') {
        this.closeView("/buildEnvironment/build/buildProject/buildProDetail", "/buildEnvironment/build/trackManagement", 0)
      }
    },
    refreshBScroll() {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        if (this.$route.query.tabActiveName) {
          this.tabActiveName = this.$route.query.tabActiveName
          this.tabChange({name: this.tabActiveName})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 30px 40px 30px;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
    .pro-name {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .pro-name-text {
        width: 80%;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }

  .main {
    width: 100%;
    height: 500px;
    display: flex;

    .left-box {
      width: 25%;
      height: 100%;
      margin-right: 20px;
    }

    .wrapper {
      width: 80%;
      height: 100%;
      position: absolute;
      top: 90px;
      bottom: 0;
      left: 15.5%;
      right: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding-top: 10px;

      span {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        margin-bottom: 10px;
      }

      .tabs-name {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
      }

      .lastDiv {
        width: 100%;
        height: 500px;
      }
    }
  }
}
</style>
