<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <table class="detail-table">
          <tr>
            <td>项目名称</td>
            <td colspan="3">{{ form.projectName }}</td>
          </tr>
          <tr>
            <td>记录时间</td>
            <td>{{ parseTime(form.recordDate, '{y}-{m}-{d}') }}</td>
            <td>地点</td>
            <td>{{ form.happenAddr }}</td>
          </tr>
          <tr>
            <td>经办人</td>
            <td>{{ form.agent }}</td>
            <td>责任人</td>
            <td>{{ form.dutyPerson }}</td>
          </tr>
          <tr>
            <td>问题描述</td>
            <td colspan="3">{{ form.questionDesc }}</td>
          </tr>
          <tr>
            <td>类别</td>
            <td colspan="3">{{ form.questionType }}</td>
          </tr>
          <template v-if="pageType !== 'dc'">
            <tr>
              <td>整改措施</td>
              <td colspan="3">{{ form.rectMeasures }}</td>
            </tr>
            <tr>
              <td>计划完成时间</td>
              <td colspan="3">{{ parseTime(form.planCompleteDate, '{y}-{m}-{d}') }}</td>
            </tr>
            <tr>
              <td>目前进展情况</td>
              <td colspan="3">{{ form.currentProgress }}</td>
            </tr>
          </template>
        </table>
        <div style="font-size: 18px;line-height: 40px;">回复内容</div>
        <el-row style="padding-top: 20px;">
          <el-col :span="20">
            <div v-if="replyList.length == 0" style="color: #999;font-size: 14px;">暂无回复</div>
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(item, index) in replyList"
                :key="index"
                :timestamp="item.createTime"
                placement="top">
                <el-card>
                  <el-collapse v-model="item.activeNames">
                    <el-collapse-item :title="'回复人：' + item.createBy" name="1">
                      <div v-html="item.replyContent"></div>
                    </el-collapse-item>
                  </el-collapse>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getReplyList"
            />
          </el-col>
        </el-row>
        <div style="text-align: center;padding: 20px 0;">
          <el-button type="primary" @click="handleReply">回 复</el-button>
          <el-button @click="handleBack">取 消</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改问题整改记录回复对话框 -->
    <el-dialog title="回复" :visible.sync="replyOpen" width="700px" append-to-body :close-on-click-modal="false">
      <el-form ref="replyForm" :model="replyForm" :rules="replyRules" label-width="80px">
        <el-form-item prop="replyContent" label-width="0">
          <ueditor v-model="replyForm.replyContent" placeholder="请输入回复内容" :height="200"></ueditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHbRectRecord } from "@/api/hb/hbRectRecord";
import { listHbRectReply, getHbRectReply, delHbRectReply, addHbRectReply, updateHbRectReply, exportHbRectReply } from "@/api/hb/hbRectReply";
import Ueditor from '@/components/Ueditor';

export default {
  name: "hb-hbRectRecord-detail",
  components: {
    Ueditor
  },
  data() {
    return {
      // 类别字典
      questionTypeOptions: [],
      // 表单参数
      form: {},
      reverse: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      replyList: [],
      replyOpen: false,
      replyForm: {},
      // 表单校验
      replyRules: {
        replyContent: [
          { required: true, message: "回复内容不能为空", trigger: "blur" }
        ]
      },
      activeNames: ['1']
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    infoId() {
      return this.$route.query.infoId;
    },
    recordType() {
      return this.$route.query.recordType;
    },
    pageType() {
      return this.$route.query.pageType || undefined;
    }
  },
  activated() {
    this.init();
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const id = this.$route.query.id
      getHbRectRecord(id).then(response => {
        this.form = response.data;
        this.getReplyList();
      });
    },
    getReplyList() {
      this.queryParams.recordId = this.form.id;
      listHbRectReply(this.queryParams).then(response => {
        this.replyList = response.rows;
        if (this.replyList.length > 0) {
          this.replyList.map(item => {
            item.activeNames = ['1'];
          })
        }
      })
    },
    handleReply() {
      this.reset();
      this.replyOpen = true;
    },
    handleChange(val) {
      console.log(val);
    },
    // 取消按钮
    cancel() {
      this.replyOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.replyForm = {
        id: undefined,
        recordId: undefined,
        replyDate: undefined,
        replyUser: undefined,
        replyContent: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("replyForm");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.replyForm.recordId = this.form.id;
      this.$refs["replyForm"].validate(valid => {
        if (valid) {
          if (this.replyForm.id != undefined) {
            updateHbRectReply(this.replyForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.getReplyList();
                this.replyOpen = false;
              }
            });
          } else {
            addHbRectReply(this.replyForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess("回复成功");
                this.getReplyList();
                this.replyOpen = false;
              }
            });
          }
        }
      });
    },
    /** 返回 */
    handleBack(time = 0) {
      const path = this.$route.path;
      let toPath = '';
      if (this.recordType == 1) toPath = `/buildEnvironment/environment/management/record?infoId=${this.infoId}&recordType=${this.recordType}`;
      this.closeView(path, toPath, time);
    }
  }
};
</script>

<style scoped>
  /deep/ .el-collapse-item__wrap, /deep/ .el-collapse-item__header, /deep/ .el-collapse {
    border: none;
  }
  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }
  /*/deep/ .el-collapse-item__header {*/
  /*  background-color: #f5f5f5;*/
  /*}*/
</style>
