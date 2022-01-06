<template>
  <div class="app-container">
    <el-row class="mb10" :gutter="20">
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:myNotice']">
        <el-button
          v-show="form.isEdit && !from"
          type="primary"
          @click="handleUpdate(form)"
          v-hasPermi="['sel:selNotice:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:myNotice']">
        <el-button
          v-show="form.publishStatus === 0"
          type="primary"
          @click="handleDelete(form)"
          v-hasPermi="['sel:selNotice:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:receiveNotice']">
        <el-button
          v-show="form.kind === 3 && form.publishStatus === 1"
          type="primary"
          v-hasPermi="['sel:selNotice:declare']"
          @click="toDeclare(form)"
        >立项
        </el-button>
      </el-col>
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
            <td>通知标题</td>
            <td>{{ form.noticeTitle }}</td>
          </tr>
          <tr>
            <td style="width: 200px;">通知简述</td>
            <td><div v-html="form.noticeObjective" /></td>
          </tr>
          <tr>
            <td>附件</td>
            <td colspan="3"><upload v-model="form.filePaths" :edit="false" /></td>
          </tr>
        </table>

        <div :hidden="isHidden || form.publishStatus == 0">
          <div class="el-tabs__header">
            <div class="el-tabs__nav-wrap">
              <div class="el-tabs__nav-scroll">
                <div class="el-tabs__nav" style="transform: translateX(0px);">
                  <div class="el-tabs__item" :class="tabIndex == '1' ? 'is-active' : ''" @click="tabIndex='1'">查阅情况</div>
                  <div class="el-tabs__item" :class="tabIndex == '2' ? 'is-active' : ''" @click="tabIndex='2'">历史版本情况</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="tabIndex == '1'">
            <div class="read-status">
              <span>未查阅：{{readStatus.noRead}}个单位</span>
              <span>已查阅：{{readStatus.read}}个单位</span>
            </div>
            <div class="table-overflow">
              <table class="history-table">
                <tr v-for="item in readDetail">
                  <td>{{item.dept_name}}</td>
                  <td>
                    <span v-if="item.read_status == '0'">未查阅</span>
                    <span v-if="item.read_status == '1'">已查阅</span>
                  </td>
                </tr>
                <tr v-if="readDetail.length === 0">
                  <td colspan="2" class="no-data">暂无数据</td>
                </tr>
              </table>
            </div>
          </div>
          <div v-show="tabIndex == '2'">
          <div class="table-overflow">
            <table class="history-table">
              <tr v-for="item in history">
                <td style="width: 300px;">{{item.publishTime}}</td>
                <td>{{item.noticeTitle}}</td>
                <td style="width: 100px; text-align: center"><el-button type="text"><router-link :to="{ path: '/msg/selNotice/detailReserveHis',query:{id:item.id,hidden: true,from:'his',toId:id} }">查看</router-link></el-button></td>
              </tr>
              <tr v-if="history.length === 0">
                <td colspan="2" class="no-data">暂无数据</td>
              </tr>
            </table>
          </div>
        </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {delSelNotice, getSelNotice} from "@/api/sel/selNotice";

export default {
  name: "msg-reserveItems-detail",
  data() {
    return {
      tabIndex: '1',
      // 表单参数
      form: {},
      readDetail: [],  //阅读详细
      history: [],  //阅读历史
      readStatus: {},  //阅读状态
      isHidden: false
    };
  },
  computed: {
    id: function () {
      return this.$route.query.id
    },
    from:function () {
      return this.$route.query.from
    },
    toId:function () {
      return this.$route.query.toId
    },
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.isHidden = this.$route.query.hidden;
      const id = this.$route.query.id;
      getSelNotice(id).then(response => {
        this.form = response.data.notice;
        this.form.isEdit = true;
        if (this.form.createTime) {
          const year = this.parseTime(this.form.createTime, '{y}');
          const nowYear = new Date().getFullYear().toString();
          if (year !== nowYear) this.form.isEdit = false;
        }
        this.readDetail = response.data.readDetail;
        this.history = response.data.history;
        this.readStatus = response.data.readStatus;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const path = '/msg/selNotice/editReserve'
      const id = row.id
      this.$router.push({
        path,
        query: {
          id,
          kind: row.kind
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delSelNotice(ids);
      }).then(() => {
        this.msgSuccess("删除成功");
        this.closeView('/msg/selNotice/detailReserve', '/msgSelNotice', 0)
      }).catch(() => {
      });
    },

    //去申报
    toDeclare(row) {
      if (row.kind === 3) {
        const path = "/proManagement/proImplement/proEstablish"
        this.$router.push({
          path
        })
      }
    },

    /** 返回 */
    handleBack() {
      let path ="/msgSelNotice"
      let id=this.id;
      if(this.from){
        path= "/msg/selNotice/detailReserve"
        id=this.toId
      }
      this.$router.push({"path": path,query:{id:id}})
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'msg-reserveItems-detail') {
        if (to.fullPath !== this.path) {
          this.path = to.fullPath+"&time="+new Date().getTime();
          this.init();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .read-status {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
    span {
      margin-right: 20px;
    }
  }
  .history-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 14px;
    td {
      border: 1px solid #e9e9e9;
      padding: 10px 15px;
    }
  }
  .table-overflow {
    width: 80%;
    min-height: 200px;
    max-height: 500px;
    overflow: auto;
  }
  .no-data {
    text-align: center;
    color: #666;
  }
  .is-active {
    border-bottom: 2px solid #68BC74;
  }
  .el-tabs__item {
    padding: 0;
    margin: 0 20px;
    &:first-child {
      margin-left: 0;
    }
  }
</style>
