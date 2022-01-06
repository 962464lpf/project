<template>
  <div>
    <!-- 评论 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="评论" name="评论">
        <el-form ref="commentForm" :model="commentForm" :rules="commentRules" label-width="0">
          <el-form-item prop="remark">
            <el-input v-model="commentForm.remark" type="textarea" placeholder="请输入评论内容" rows="4" maxlength="500" show-word-limit/>
          </el-form-item>
          <div class="mt20">
            <upload v-model="commentForm.filePaths" style="display: inline-block;"/>
            <el-button
              type="primary"
              @click="submitComment"
              class="fr"
            >发表</el-button>
          </div>
        </el-form>
        <!-- 评论列表 -->
        <el-row class="mt20">
          <el-col :span="12">
            <div v-if="commentList.length == 0" class="no-data">暂无评论</div>
            <div class="comment">
              <div class="comment-item clearfix" v-for="item in commentList">
                <div class="comment-item-avatar">
                  <img :src="item.commentUserAvatar" alt="">
                </div>
                <div class="comment-item-content">
                  <div class="comment-item-name">{{ item.commentUserName }}</div>
                  <div class="comment-item-date">{{ item.createTime }}</div>
                  <div class="comment-item-text">{{ item.remark }}</div>
                  <upload v-if="item.filePaths!=null" v-model="item.filePaths" :edit="false"></upload>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <pagination
          v-show="commentTotal > 0"
          :total="commentTotal"
          :page.sync="commentQueryParams.pageNum"
          :limit.sync="commentQueryParams.pageSize"
          @pagination="getCommentList"
        />
      </el-tab-pane>
      <el-tab-pane label="查阅情况" name="查阅情况">
        <el-table :data="lookList">
          <el-table-column prop="consultUserName" label="查阅人"> </el-table-column>
          <el-table-column prop="consultStatus" label="查阅状态" :formatter="formatStatus"> </el-table-column>
          <el-table-column prop="consultTime" label="时间"> </el-table-column>
        </el-table>
        <pagination
          v-show="lookTotal > 0"
          :total="lookTotal"
          :page.sync="lookQueryParams.pageNum"
          :limit.sync="lookQueryParams.pageSize"
          @pagination="getLookList"
        />
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="操作日志">
        <el-table :data="logList">
          <el-table-column prop="operUserName" label="操作人"> </el-table-column>
          <el-table-column prop="operName" label="操作事件"> </el-table-column>
          <el-table-column prop="createTime" label="时间"> </el-table-column>
        </el-table>
        <pagination
          v-show="logTotal > 0"
          :total="logTotal"
          :page.sync="logQueryParams.pageNum"
          :limit.sync="logQueryParams.pageSize"
          @pagination="getLogList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { listFlowComment, addFlowComment,listFlowConsult,listFlowOperLog } from "@/api/activiti/flowComment";
export default {
  data() {
    return {
      instanceId: this.id,
      //当前所在的tab名
      activeName: '评论',
      //审批意见表单
      commentForm: {},
      //审批意见表单校验
      commentRules: {
        remark: [
          { required: true, message: "评论内容不能为空", trigger: "blur" }
        ]
      },
      // 评论查询参数
      commentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        instanceId: this.id
      },
      //评论总数
      commentTotal: 100,
      //评论列表
      commentList: [],
      // 查阅查询参数
      lookQueryParams: {
        pageNum: 1,
        pageSize: 10,
        instanceId: this.id
      },
      //查阅总数
      lookTotal: 100,
      //查阅情况列表
      lookList: [],
      // 操作日志查询参数
      logQueryParams: {
        pageNum: 1,
        pageSize: 10,
        instanceId: this.id
      },
      //操作日志总数
      logTotal: 100,
      //操作日志列表
      logList: [],
    };
  },
  props: {
    id: {
      default: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCommentList(this.id);
    },
    //评论处选项卡切换
    handleTabClick() {
      // 点击在加载数据
      if (this.activeName === '查阅情况') {
          this.getLookList();
      }
      if (this.activeName === '操作日志') {
          this.getLogList();
      }
    },
    //发表按钮
    submitComment() {
      this.commentForm.instanceId = this.instanceId
      this.$refs["commentForm"].validate(valid => {
        if (valid) {
          addFlowComment(this.commentForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg);
              this.getCommentList(this.id);
              this.resetForm("commentForm");
              this.commentForm.filePaths = undefined
            }else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    formatStatus(row,column){
       if(row.consultStatus=='0') {
          return '未查阅'
       }else{
           return '已查阅'
       }

    },
    //获取评论列表
    getCommentList(id) {
      listFlowComment(this.commentQueryParams).then(response => {
          this.commentList = response.rows;
          this.commentTotal = response.total;
        }
      );
    },
    //获取查阅列表
    getLookList() {
        listFlowConsult(this.lookQueryParams).then(response => {
            this.lookList = response.rows;
            this.lookTotal = response.total;
          }
        );
    },
    //获取日志列表
    getLogList() {
        listFlowOperLog(this.logQueryParams).then(response => {
            this.logList = response.rows;
            this.logTotal = response.total;
          }
        );
    }
  }
};
</script>

<style lang="scss" scoped>
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
  }
  .comment {
    padding-bottom: 20px;
  }
  .comment-item {
    margin-bottom: 20px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    box-shadow: 0 1px 10px 0 rgba(0,0,0,.1);
    padding: 20px;
    border-radius: 4px;
    .comment-item-avatar {
      float: left;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 46px;
        height: 46px;
      }
    }
    .comment-item-content {
      margin-left: 64px;
      .comment-item-name {
        line-height: 28px;
        font-width: 700;
      }
      .comment-item-date {
        color: #666666;
        font-size: 14px;
      }
      .comment-item-text {
        padding-top: 15px;
      }
    }
  }
  .no-data {
    color: #999999;
    font-size: 14px;
  }
</style>
