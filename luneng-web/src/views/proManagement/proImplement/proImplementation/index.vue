<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 200px"
            type="year"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery">查询
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="main-center">
        <div v-if="proImplementPlanList.length > 0">
          <gantt-elastic
            :options="options2"
            :tasks="tasks"
            @tasks-changed="tasksUpdates">
            <gantt-header slot="header"></gantt-header>
          </gantt-elastic>
        </div>
        <div v-else>
          <el-table-temp
            :pro-implement-plan-list-tem="proImplementPlanListTem"
            :query-params-tem="queryParams"
          />
        </div>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>
import GanttElastic from 'gantt-elastic'
import Header from "gantt-elastic-header"
import {listProPlayPlan} from "@/api/pro/proImplementPlan";
import elTableTemp from './childCom/elTableTemp'

export default {
  name: "index",
  data() {
    const that = this
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        curYear: null
      },
      total: 0,
      curYearTem: new Date(),
      options2: {
        maxRows: 100,
        maxHeight: 1000,
        title: {
          label: '项目实施甘特图',
          html: false,
        },
        row: {
          height: 58
        },
        times: {
          timeScale: 30 * 1000,
          timeZoom: 20
        },
        chart: {
          progress: {
            width: 20, //*
            height: 6, //*
            pattern: true,
            bar: false
          },
          text: {
            offset: 4,
            xPadding: 10,
            display: true
          },
          expander: {
            type: 'chart',
            display: true,
            displayIfTaskListHidden: true,
            offset: 4,
            size: 16
          },
          grid: {
            horizontal: {
              gap: 8
            }
          }
        },
        taskList: {
          columns: [
            {
              id: 1,
              label: 'ID',
              value: 'id',
              width: 0
            },
            {
              id: 2,
              label: '项目名称',
              value: 'projectName',
              width: 230,
              expander: true,
              html: true,
              events: {
                click({data}) {
                  console.log(data.type)
                  if (data.type === 'project') {
                    that.navProDetail(data.id)
                  } else {
                    that.navPlanResultList(data.parentId)
                  }
                }
              },
              style: {
                "task-list-header-label": {
                  "text-align": "center",
                  "width": "100%",
                  "color": "#515a6e",
                  "font-size": "18px"
                },
                "task-list-item-value-container": {
                  "text-align": "center",
                  "width": "100%",
                },
                "task-list-item-value": {
                  "word-break": "break-all",
                  "overflow": "",
                  "white-space": "",
                  "color": "#000000",
                  "font-size": "18px",
                  "cursor": "pointer",
                  "line-height": "20px"
                }
              }
            },
            {
              id: 3,
              label: '合同签订时间',
              value: 'contractYear',
              width: 160,
              html: false,
              events: {
                click({data}) {

                }
              },
              style: {
                "task-list-header-label": {
                  "text-align": "center",
                  "width": "100%",
                  "color": "#515a6e",
                  "font-size": "18px"
                },
                "task-list-item-value-container": {
                  "text-align": "center",
                  "width": "100%",
                },
                "task-list-item-value": {
                  "word-break": "break-all",
                  "overflow": "",
                  "white-space": "",
                  "color": "#000000",
                  "font-size": "18px"
                }
              }
            },
            {
              id: 4,
              label: '合同金额(万元)',
              value: 'contractAmount',
              width: 160,
              html: true,
              events: {
                click({data}) {

                }
              },
              style: {
                "task-list-header-label": {
                  "text-align": "center",
                  "width": "100%",
                  "color": "#515a6e",
                  "font-size": "18px"
                },
                "task-list-item-value-container": {
                  "text-align": "center",
                  "width": "100%",
                },
                "task-list-item-value": {
                  "word-break": "break-all",
                  "overflow": "",
                  "white-space": "",
                  "color": "#000000",
                  "font-size": "18px"
                }
              }
            }
          ]
        },
        calendar: {
          workingDays: [1, 2, 3, 4, 5],
          gap: 0,
          strokeWidth: 5,
          hour: {
            display: false
          }
        },
        locale: {
          name: "zh",
          Now: "当前时间",
          weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          months:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        }
      },
      tasks: [],
      proImplementPlanList: [],
      proImplementPlanListTem: []
    }
  },
  created() {
    let that = this
    this.getList()
  },
  components: {
    GanttElastic,
    'gantt-header': Header,
    elTableTemp
  },
  methods: {
    //获取项目实施计划列表
    getList() {
      this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
      listProPlayPlan(this.queryParams).then(({rows, total}) => {
        if (rows && rows.length > 0) {
          let  proImplementPlanTem1 = []
          let  proImplementPlanTem2 = []
          let  hasProjectPeriodFlag = false
          this.proImplementPlanList = []
          this.proImplementPlanListTem = []
          rows.forEach(item => {
            if (item.duration) {
              hasProjectPeriodFlag = true
              item.width = 10
              item.height = 10
              if (item.type === 'project') {
                item.projectName = `<div style="color: #2d4462;">${item.projectName}</div>
                                    <div style="color: #666; font-size: 16px; margin-top: 5px;">${item.contractCompany}</div>`
                item.contractAmount = `<div title="${item.contractAmount * 10000}元">
                                         ${ Math.floor(item.contractAmount) }
                                       </div>`
              } else {
                item.projectName = `<div style="color: #65a9b8; font-size: 16px;">${item.projectName}</div>`
              }
              if (item.type === 'task') {
                item.style = {
                  base: {
                    fill: "#9ac6cf",
                      stroke: "#9ac6cf",
                  },
                }
              } else {
                item.style = {
                  base: {
                    fill: "#2d4462",
                    stroke: "#2d4462",
                  }
                }
              }
              proImplementPlanTem1.push(item)
            } else {
              proImplementPlanTem2.push(item)
            }
          })
          if (hasProjectPeriodFlag) {
            this.proImplementPlanList = [...proImplementPlanTem1, ...proImplementPlanTem2]
            this.tasksUpdates(this.proImplementPlanList, 2)
          } else {
            this.proImplementPlanListTem = proImplementPlanTem2
          }
          this.total = total;
        } else {
          this.proImplementPlanList = rows
          this.proImplementPlanListTem = rows
          this.total = total;
        }
      })
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curYearTem = new Date()
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //甘特图表赋值
    tasksUpdates(tasks, index) {
      if (index === 2) {
        this.tasks = tasks
      }
    },
    //查看项目详情
    navProDetail(id) {
      const path = '/proManagement/proImplement/proEstablish/proMainTask'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '6',
          tabActiveName: '7'
        }
      })
    },
    //查看成果文件列表
    navPlanResultList(id) {
      const path = '/proManagement/proImplement/proImplementation/playResults'
      this.$router.push({
        'path': path,
        'query': {
          id
        }
      })
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
    margin-bottom: 20px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-top, .main-center {
      width: 100%;
    }
    .main-center {
      ::v-deep .gantt-elastic__header-title--text {
        display: none;
      }
      ::v-deep .gantt-elastic__task-list-header-column {
        .gantt-elastic__task-list-expander-wrapper {
          display: none !important;
        }
      }
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
