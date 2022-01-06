<template>
  <div class="header-message">
    <div class="message" :class="isShowClass ? 'hide': ''">
      <div class="infinite-list-wrapper" style="overflow:auto;height: 100%;padding-top: 15px;">
        <template v-for="(item, index) in list">
          <div class="message-item" @click="handleDetail(item, index)">
            <div class="message-item-header">
              <img src="../../assets/logo/logo.png"></img>
              <span>科信部</span>
              <span class="message-item-time">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
              <div class="message-btn el-icon-error" @click.stop="neglect(item, index)"></div>
            </div>
            <div class="message-item-title">{{item.noticeTitle}}</div>
            <div class="message-item-content">{{item.noticeObjective}}</div>
          </div>
        </template>
        <div v-if="list.length == 0 && isLoad" class="no-data">暂无通知公告</div>
        <!--        <div v-if="noMoreData" class="no-data">没有更多的数据了</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {listSelNessage, updateStatusMessage, updateMessage} from "@/api/sel/selNotice";
  import {ip} from "@/settings";

  export default {
    name: 'Message',
    data() {
      return {
        list: [],
        tabIndex: 0,
        isShowMessage: false,   //是否展示弹层
        isShowClass: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: undefined,
          sender: undefined,
          receiver: undefined,
          msgInfoId: undefined,
          status: 0,
          routerName: undefined  //消息类型
        },
        // 查询参数
        queryType: {
          type: '1',
        },
        messageList: [],
        isLoad: false,
        // 总条数
        total: 0,
        isScrollDisabled: false,
        distance: 10,
        noMoreData: true
      }
    },
    computed: {
      name: {
        get() {
          return this.$store.state.user.name
        }
      },
      msgNoRead: {
        set(val) {
          this.$store.commit('SET_MSGNOREAD', val)
        },
        get() {
          return this.$store.state.user.msgNoRead
        }
      },
      message: {
        get() {
          return this.$store.state.settings.showMessage
        },
        set(val) {
          this.$store.dispatch('settings/changeSetting', {
            key: 'showMessage',
            value: val
          })
        }
      },
      theme() {
        return this.$store.state.settings.theme
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      themeStyle() {
        return {
          "background-color": this.theme,
          "border-color": this.theme
        };
      },
      /** 查询消息列表 */
      getList() {
        this.loading = true;
        listSelNessage(this.queryType).then(response => {
          this.list = response.rows;
          this.isLoad = true
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 查看详情操作 */
      handleDetail(row) {
        updateStatusMessage(row.id).then(response => {
          let id = response.data.id;
          let path = "";
          if (row.kind == 1) {
            path = "/msg/selNotice/detailNotice";
          } else if (row.kind == 2 || row.kind == 12) {
            path = "/msg/selNotice/detailPro";
          } else if (row.kind == 3) {
            path = "/msg/selNotice/detailReserve";
          } else if (row.kind == 4) {
            path = "/sel/selRecognition";
          } else if (row.kind == 5) {
            path = "/proManagement/storage/projectStorageInfo";
          } else if (row.kind == 6) {
            path = "/user/profile";
          } else if (row.kind == 7) {
            path = "/proManagement/proImplement/proLaunch/playPlanDetailKXB";
          } else if (row.kind == 8) {
            // 奖励评选打包通知
            path = "/sel/awardAudit"
          } else if (row.kind == 9) {
            // 绿建打包通知
            path = "/buildEnvironment/build/buildProject"
          } else if (row.kind == 10) {
            // 提醒上传绿建认证目标建议书签字版扫描件
            path = "/buildEnvironment/build/confirmGoal"
          } else if (row.kind == 11){
              //环保项目打包通知
              path = "/buildEnvironment/environment/project"
          } else if (row.kind == 13){
              //path = "/meeting/meetingManage/noticeReceipt"
              path = "/meeting/management/queryAgenda"
          }else if (row.kind == 14){//会议纪要详情
              path = "/meeting/management/editMeetingSummary"
          }else if(row.kind == 15 || row.kind == 16){
              path = row.remark;
          }
            if(row.kind == 13){
                this.$router.push({
                    "path": path,
                    "query": {"id": row.remark}
                })
            }else if (row.kind == 14) {
                this.$router.push({
                    "path": path,
                    "query": {"id": row.remark, onlyRead: '1'}
                })
          }  else if (row.kind == 15 || row.kind == 16) {
                this.$router.push({
                    "path": path
                })
            } else if (row.kind != 7) {
            this.$router.push({
              "path": path,
              "query": {"id": id, hidden: true, "kind":row.kind}
            })
          } else {
            this.$router.push({
              "path": path,
              "query": {"id": id, detailFlag: '1'}
            })
          }

          this.getList();
          this.hideMessage();
          let number = response.data.number;
          this.msgNoRead = this.msgNoRead - number;
        })
      },
      tabChange(index) {
        this.tabIndex = index;
        if (this.tabList[this.tabIndex].isLoad) return
        this.queryType.type = this.tabList[this.tabIndex].key;
        this.getList();
      },
      showMessage() {
        this.isShowMessage = true;
        this.isShowClass = false;
      },
      hideMessage() {
        this.message = false;
      },
      neglect(row) {
        updateMessage(row.id).then(response => {
          this.$store.dispatch("GetInfo");
          this.getList();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-message {
    cursor: default !important;

    .header-message-icon {
      color: #fff;
      cursor: pointer;
      position: relative;
      margin-right: 6px;

      span {
        font-size: 16px;
        margin-left: 8px;
        vertical-align: middle;
      }

      .message-num {
        position: absolute;
        top: 10px;
        left: 8px;
        height: 16px;
        padding: 0 4px;
        text-align: center;
        line-height: 14px;
        font-size: 12px;
        color: #FFFFFF;
        background-color: red;
        border: 1px solid #FFFFFF;
        border-radius: 8px;
      }

      .el-icon-bell::before {
        vertical-align: middle;
      }
    }

    .mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
    }

    .message {
      padding: 0 15px;
      position: fixed;
      top: 50px;
      right: 0;
      bottom: 35px;
      width: 400px;
      background-color: #f4f4f4;
      font-size: 14px;
      color: #222222;
      animation: show 0.4s;
      z-index: 2000;

      &.hide {
        animation: hide 0.4s forwards;
      }

      .el-scrollbar {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 80px);
      }

      .message-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        background-color: #ffffff;
        overflow: hidden;
        margin-bottom: 10px;

        .message-btn {
          display: none;
          opacity: 0;
          border: none;
        }

        &:hover .message-btn {
          display: inline-block;
          opacity: 1;
          line-height: 30px;
          font-size: 16px;
          float: right;
          color: #666;
        }

        .message-btn:hover {
          opacity: 0.8;
        }

        &:hover .message-item-time {
          display: none;
        }

        .message-item-header {
          padding: 0 10px;
          line-height: 30px;
          background-color: #f7f7f7;
          color: #666;
          font-weight: bold;

          span {
            vertical-align: middle;
          }

          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 4px;
            vertical-align: middle;
          }

          .message-item-time {
            color: #999999;
            float: right;
            font-weight: 400;
          }
        }
      }

      .message-item-title {
        font-weight: bold;
        padding: 10px 10px 2px 20px;
        color: #333;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 300px;
      }

      .text-ellipsis {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 180px;
      }

      .message-item-content {
        line-height: 24px;
        padding: 0 10px 0px 20px;
        color: #777;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        margin-bottom: 10px;
      }
    }
  }

  @keyframes show {
    from {
      right: -360px;
    }
    to {
      right: 0;
    }
  }

  @-moz-keyframes show {
    from {
      right: -360px;
    }
    to {
      right: 0;
    }
  }

  @-webkit-keyframes show {
    from {
      right: -360px;
    }
    to {
      right: 0;
    }
  }

  @-o-keyframes show {
    from {
      right: -360px;
    }
    to {
      right: 0;
    }
  }

  @keyframes hide {
    from {
      right: 0;
    }
    to {
      right: -380px;
    }
  }

  @-moz-keyframes hide {
    from {
      right: 0;
    }
    to {
      right: -380px;
    }
  }

  @-webkit-keyframes hide {
    from {
      right: 0;
    }
    to {
      right: -380px;
    }
  }

  @-o-keyframes hide {
    from {
      right: 0;
    }
    to {
      right: -380px;
    }
  }

  .load-more {
    text-align: center;

    .el-icon-loading {
      font-size: 16px;
    }

    span {
      color: #999;
    }
  }

  .no-data {
    text-align: center;
    color: #999999;
    padding: 20px 0;
  }
</style>
