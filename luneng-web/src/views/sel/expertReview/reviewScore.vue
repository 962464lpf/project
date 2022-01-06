<template>
  <div class="app-container">
    <div class="main">
      <div class="main-top">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              :disabled="endFlag"
              @click="allReviewEnd"
              v-hasPermi="['sel:selDeclareReviewResult:batchSave']">评审结束
            </el-button>
            <el-button
              type="primary"
              @click="getListRefresh">重新排序
            </el-button>
          </el-col>
          <el-col :span="16">
            <div class="el-upload__tip" style="color: red; font-size: 18px;">
              全部项目评审结束必须每个项目至少三个专家打分；单个项目评审结束必须至少三个专家打分
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="expertReviewProjs">
          <el-table-column
            label="序号"
            width="100"
            align="center"
            type="index"
            fixed="left"/>
          <el-table-column
            label="项目名称"
            align="center"
            width="300"
            prop="project_name"
            fixed="left"
            />
          <el-table-column
            label="最高分"
            width="90"
            align="center"
            :formatter="maxScoreFixed2"
            prop="maxScore"
            fixed="left"
            >
          </el-table-column>
          <el-table-column
            label="最低分"
            width="90"
            align="center"
            :formatter="minScoreFixed2"
            prop="minScore"
            fixed="left"
            >
          </el-table-column>
          <el-table-column
            label="平均分"
            width="90"
            align="center"
            :formatter="avgScoreFixed2"
            prop="avgScore"
            fixed="left"
            >
          </el-table-column>
          <el-table-column
            label="未打分"
            width="90"
            align="center"
            prop="number"
            :formatter="noScoreFormatter"
            fixed="left"
            >
          </el-table-column>
          <el-table-column
            label="评审结束"
            width="120"
            align="center"
            class-name="small-padding"
            fixed="left">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleReviewEnd(scope.row)"
                :disabled="scope.row.personNum<=2||scope.row.declare_status!=15"
                v-hasPermi="['sel:selDeclareReviewResult:batchSave']">评审结束
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="expertGroupMember.length > 0"
            v-for="(item, index) in expertGroupMember"
            :key="index"
            :label="item.name"
            align="center"
            :prop="item.name"
            >
          </el-table-column>
          <el-table-column
            v-if="expertGroupMember.length <= 0"
            label="暂无专家打分数据"
            align="center"
            prop="--"
            >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {listExpertReviewProj} from "@/api/expert/expertReview";
  import {getReviewExpertList} from "@/api/expert/expert";
  import {reviewEnd, taskTest} from '@/api/sel/selDeclareReviewResult'

  export default {
    name: "",
    data() {
      return {
        // 加载等待线
        loading: true,
        endFlag: true,
        // 专家组表格数据
        expertReviewProjs: [],
        //专家组成员数据
        expertGroupMember: [],
        //当前申报项目id
        currId: null,
        //当前评审专家组id
        expertGroupId: null
      }
    },
    created() {
      //获取跳转路由id
      if (this.$route.query.id) {
        this.currId = this.$route.query.id
      }
      //获取专家组列表
      this.getList();
      //获取专家组成员列表
      this.getExpertGroupList({
        reviewId: this.$route.query.id
      })
    },
    activated() {
      this.getList()
    },
    methods: {
      /********************* 获取及处理数据 **********************/
      /** 查询专家组列表 */
      getList() {
        this.loading = true;
        let numFlag = false;
        let statusFlag = false;
        listExpertReviewProj(this.currId).then(response => {
          console.log(response.data);
          this.expertReviewProjs = response.data;
          this.loading = false;
          if (response.data.length > 0) {
            this.endFlag = false;
          } else {
            this.endFlag = true;
          }
          response.data.some(data => {
            if (data.personNum < 3) {
              numFlag = true;
            }
            if (data.declare_status == 15) {
              statusFlag = true;
            }
          })
          if (numFlag) {
            this.endFlag = true;
          } else if (!numFlag && !statusFlag) {
            this.endFlag = true;
          }
        })
      },
      /** 根据id查询专家组 */
      getExpertGroupList(query) {
        this.loading = true;
        getReviewExpertList(query).then(response => {
          this.expertGroupMember = response.data
        })
      },
      //刷新重新排序
      getListRefresh() {
        this.getExpertGroupList({
          reviewId: this.$route.query.id
        })
        this.getList()
      },
      //未打分内容过滤
      noScoreFormatter(row) {
        if (row.number) {
          return row.number + '人'
        } else {
          return '无'
        }
      },
      //分数保留两位
      maxScoreFixed2({maxScore}) {
        if (maxScore) {
          return (maxScore * 1).toFixed(2)
        }
      },
      minScoreFixed2({minScore}) {
        if (minScore) {
          return (minScore * 1).toFixed(2)
        }
      },
      avgScoreFixed2({avgScore}) {
        if (avgScore) {
          return (avgScore * 1).toFixed(2)
        }
      },

      /********************* 交互操作 **********************/
      /** 搜索按钮操作 */
      //评审结束按钮
      handleReviewEnd(row) {
        const ids = [];
        ids.push(row.id);
        this.$confirm("评审结束，未打分专家将不可继续打分", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return reviewEnd({ids: ids, type: 1});
        }).then(res => {
          this.msgSuccess(res.msg);
          this.getList();
        }).catch(function () {
        });
      },
      //所有评审结束
      allReviewEnd() {
        const ids = [];
        this.expertReviewProjs.some(item => {
          if (item.declare_status == 15) {
            ids.push(item.id);
          }
        })
        this.$confirm("评审结束，下发专家评审结果", "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return reviewEnd({ids: ids, type: 2});
        }).then(res => {
          this.msgSuccess(res.msg);
          this.getList();
        }).catch(function () {
        });
      },
      // 定时任务测试
      taskTest() {
        taskTest().then(res => {

        })
      }
      // scoreFormatter(row) {
      //   this.expertGroupMember.some(expert => {
      //     row.(expert.name)=
      //   })
      //   return row.name == -1 ? "--" : row.name
      // }
    }
  }
</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 30px 50px 30px;
    display: flex;
    flex-direction: column;

    .main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .main-top, .main-center {
        width: 100%;
      }

      .main-footer {
        width: 420px;
        margin-top: 20px;
      }
    }
  }
</style>
