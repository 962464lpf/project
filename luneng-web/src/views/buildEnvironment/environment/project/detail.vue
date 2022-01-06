<template>
  <div class="app-container" style="height: calc(100vh - 130px);">
    <div class="header">
      <div class="pro-name">
        <div class="pro-name-text" v-if="form.projectName">{{ form.projectName }}</div>
        <div>
          <el-row :gutter="15">
            <el-col :span="1.5">
              <el-button
                v-if="form.fileStatus != '1' && form.canDel"
                type="danger"
                @click="handleDelete(form)"
                v-hasPermi="['hb:hbProjectInfo:remove']"
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
      <div class="pro-steps">
        <el-steps :active="projectStatus" align-center>
          <el-step v-for="item in tabsInfoList" :title="item.label" :key="item.value"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main" style="flex: 1;">
      <el-tabs tab-position="left" v-model="tabActiveName" @tab-click="tabChange">
        <el-tab-pane
          :label="item.label"
          :name="item.value"
          v-for="item in tabsInfoList"
          :key="item.value">
        </el-tab-pane>
      </el-tabs>
      <b-scroll
        class="wrapper"
        ref="scroll"
        @bscroll="bScroll"
        :probe-type='3'>
        <div class="b-scroll-item" ref="bScrollItem1">
          <span class="b-scroll-title">基本信息</span>
          <info v-model="form" :edit="hbProjectInfoEdit" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem2">
          <span class="b-scroll-title">确定环评类别</span>
          <confirm v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem3">
          <span class="b-scroll-title">启动报告编制</span>
          <start v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem4">
          <span class="b-scroll-title">完成报告批复</span>
          <finish v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem5">
          <span class="b-scroll-title">环保施工应急</span>
          <emergency v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem6">
          <span class="b-scroll-title">竣工环保验收</span>
          <check v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem7">
          <span class="b-scroll-title">专家评审</span>
          <review v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem8">
          <span class="b-scroll-title">环保工作管理</span>
          <management v-model="form" @success="init(1)" />
        </div>
        <div class="b-scroll-item" ref="bScrollItem9">
          <span class="b-scroll-title">环保验收</span>
          <acceptance-check v-model="form" @success="init(1)" />
        </div>
        <div class="lastDiv" ref="lastDiv"></div>
      </b-scroll>
    </div>
    <div v-hasPermi="['hb:hbProjectInfo:edit']" id="hbProjectInfoEdit"></div>
  </div>
</template>

<script>
  import info from './components/info';
  import confirm from './components/confirm';
  import start from './components/start';
  import finish from "./components/finish";
  import emergency from './components/emergency';
  import check from './components/check';
  import review from './components/review';
  import management from './components/management';
  import acceptanceCheck from './components/acceptance-check';

  import BScroll from '@/components/BScroll'
  import PdfView from "@/components/PdfView";
  import { listHbProjectInfo, getHbProjectInfo, delHbProjectInfo, addHbProjectInfo, updateHbProjectInfo, exportHbProjectInfo } from "@/api/hb/hbProjectInfo";

  export default {
    name: "buildEnvironment-environment-project-detail",
    data() {
      return {
        //项目状态
        proStatusOptions: [],
        projectStatus: 0,
        tabActiveName: '0',
        tabsInfoList: [
          {
            value: '0',
            label: '基本信息'
          },
          {
            value: '1',
            label: '确定环评类别'
          },
          {
            value: '2',
            label: '启动报告编制'
          },
          {
            value: '3',
            label: '完成报告批复'
          },
          {
            value: '4',
            label: '环保施工应急'
          },
          {
            value: '5',
            label: '竣工环保验收'
          },
          {
            value: '6',
            label: '专家评审'
          },
          {
            value: '7',
            label: '环保验收'
          }
        ],
        //上传文件相关配置
        pdfLimit: 1,
        open: false,
        form: {},
        hbProjectInfoEdit: true
      }
    },
    created() {
      this.init();
    },
    activated() {
      this.init();
    },
    mounted() {
      let hbProjectInfoEdit = document.getElementById('hbProjectInfoEdit');
      hbProjectInfoEdit ? this.hbProjectInfoEdit = true : this.hbProjectInfoEdit = false;
    },
    computed: {
      pageType() {
        return this.$route.query.pageType;
      },
      id() {
        return this.$route.query.id;
      },
      active() {
        return this.$route.query.active;
      },
    },
    components: {
      info,
      confirm,
      start,
      finish,
      emergency,
      check,
      review,
      management,
      acceptanceCheck,
      BScroll,
      PdfView
    },
    methods: {
      init(notScroll) {
        getHbProjectInfo(this.id).then(res => {
          this.form = res.data;
          this.projectStatus = this.form.projectStatus;
          if(notScroll) return;
          if(this.active) this.tabActiveName = this.active;
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.tabChange({name: this.tabActiveName});
          })
        })
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getHbProjectInfo(row.id).then(response => {
            if (response.data.fileStatus == 1) {
              this.init()
              this.msgInfo('该项目已归档，暂时无法操作')
            } else {
              delHbProjectInfo(ids).then(() => {
                this.handleBack()
                this.msgSuccess('删除成功')
              })
            }
          })
        }).catch(function() {
        })
      },

      //监听滚动事件
      bScroll(position) {
        position.y = position.y-20;
        if (-position.y >= this.$refs.bScrollItem9.offsetTop) {
          this.tabActiveName = '8'
        } else if (-position.y >= this.$refs.bScrollItem8.offsetTop) {
          this.tabActiveName = '7'
        } else if (-position.y >= this.$refs.bScrollItem7.offsetTop) {
          this.tabActiveName = '6'
        } else if (-position.y >= this.$refs.bScrollItem6.offsetTop) {
          this.tabActiveName = '5'
        } else if (-position.y >= this.$refs.bScrollItem5.offsetTop) {
          this.tabActiveName = '4'
        } else if (-position.y >= this.$refs.bScrollItem4.offsetTop) {
          this.tabActiveName = '3'
        } else if (-position.y >= this.$refs.bScrollItem3.offsetTop) {
          this.tabActiveName = '2'
        } else if (-position.y >= this.$refs.bScrollItem2.offsetTop) {
          this.tabActiveName = '1'
        } else {
          this.tabActiveName = '0'
        }
      },
      tabChange(value) {
        switch (value.name) {
          case '0':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem1.offsetTop)
            break;
          case '1':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem2.offsetTop)
            break;
          case '2':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem3.offsetTop)
            break;
          case '3':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem4.offsetTop)
            break;
          case '4':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem5.offsetTop)
            break;
          case '5':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem6.offsetTop)
            break;
          case '6':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem7.offsetTop)
            break;
          case '7':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem8.offsetTop)
            break;
          case '8':
            this.$refs.scroll.scrollTo(0, -this.$refs.bScrollItem9.offsetTop)
            break;
        }
      },
      handleBack() {
        let toPath = "/buildEnvironment/environment/project";
        if(this.pageType) {
          toPath = "/buildEnvironment/environment/" + this.pageType;
        }
        this.closeView("/buildEnvironment/environment/project/detail", toPath, 0);
      },
      refreshBScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          if (this.$route.query.tabActiveName) {
            this.tabActiveName = this.$route.query.tabActiveName
            this.tabChange({name: this.tabActiveName})
          }
        })
      },
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
      margin-bottom: 20px;

      .pro-name {
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        .pro-name-text {
          width: 80%;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .pro-steps {
        width: 90%;
      }
    }

    .main {
      width: 100%;
      display: flex;
      position: relative;
      .wrapper {
        height: 100%;
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 160px;
        right: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .b-scroll-item {
          width: 100%;
          padding-bottom: 30px;
        }

        .b-scroll-title {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          padding-bottom: 20px;
          display: block;
        }

        .lastDiv {
          width: 100%;
          height: 500px;
        }
      }
    }
  }
</style>
