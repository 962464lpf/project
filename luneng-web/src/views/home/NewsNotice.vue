<template>
  <div class="news-notice">
    <div class="news-notice-box">
      <div class="top">
        <div class="text">通知公告</div>
        <div class="more" @click="navRouter(1)">
          <span>MORE</span>
          <span> > </span>
        </div>
      </div>
      <div class="container">
        <div class="item-box" v-for="item in selNoticeList" :key="item.id" @click="navSelNotice(item, true)">
          <div class="text">{{ item.noticeTitle }}</div>
          <div v-if="item.readStatus === 0" class="new">new</div>
          <div class="date">{{ parseTime( item.publishTime, '{y}-{m}-{d}') }}</div>
        </div>
      </div>
    </div>
    <div class="news-notice-box">
      <div class="top">
        <div class="text">成果展示</div>
        <div class="more" @click="navRouter(2)">
          <span>MORE</span>
          <span> > </span>
        </div>
      </div>
      <div class="container">
        <div class="item-box" v-for="item in achievementList" :key="item.id" @click="navAchieDisplay(item)">
          <div class="text">{{ item.achieName }}</div>
          <div class="date">{{ parseTime(item.createTime, '{y}-{m}-{d}') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {listAchieDisplayInfo} from "@/api/achie/achieDisplayInfo";
import {byNoticeUpdate, listSelNotice} from "@/api/sel/selNotice";

export default {
  name: "NewsNotice",
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        publishYear: null
      },
      achievementList: [],
      queryParams1: {
        pageNum: 1,
        pageSize: 5,
        publishTime: new Date().getFullYear() + '',
        type: '2'
      },
      selNoticeList: [],
        perms: []
    }
  },
  created() {
    this.perms = this.$store.state.user.permissions;
    if(this.perms.indexOf("achie:achieDisplayInfo:list") >= 0 || this.$store.state.user.name=='admin'){
        this.getAchieDisplayList()
    }
      if(this.perms.indexOf("sel:selNotice:list") >= 0 || this.$store.state.user.name=='admin'){
          this.getSelNoticeList()
      }
  },
  computed: {
    msgNoRead: {
      set(val) {
        this.$store.commit('SET_MSGNOREAD', val)
      },
      get() {
        return this.$store.state.user.msgNoRead
      }
    }
  },
  methods: {
    //查询通知
    getSelNoticeList() {
      listSelNotice(this.queryParams1).then(({rows}) => {
        this.selNoticeList = rows;
      })
    },
    //查询成果展示
    getAchieDisplayList() {
      this.queryParams.publishYear = this.parseTime(new Date(), "{y}");
      listAchieDisplayInfo(this.queryParams).then(({rows}) => {
        this.achievementList = rows.filter((item) => {
          return item.publishStatus === 1
        })
      });
    },
    //查看通知详情
    navSelNotice(item, isHidden) {
      byNoticeUpdate(item.id).then(response => {
        this.msgNoRead = this.msgNoRead - response.data;
      })
      let path = ''
      if (item.kind === 1) {
        path = "/msg/selNotice/detailNotice"
      } else if (item.kind === 2 || item.kind === 12) {
        path = "/msg/selNotice/detailPro"
      } else if (item.kind === 3) {
        path = "/msg/selNotice/detailReserve"
      } else if (item.kind === 7) {
        path = "/proManagement/proImplement/proLaunch/playPlanDetailKXB"
      } else if (item.kind === 6) {
        path = "/user/profile"
      } else if (item.kind === 5) {
        path = "/proManagement/storage/projectStorageInfo"
      } else if (item.kind === 4) {
        path = "/sel/selRecognition"
      } else if (item.kind === 8) {
        // 奖励评选打包通知
        path = "/sel/awardAudit"
      } else if (item.kind === 9) {
        // 绿建打包通知
        path = "/buildEnvironment/build/buildProject"
      } else if (item.kind === 10) {
        // 提醒上传绿建认证目标建议书签字版扫描件
        path = "/buildEnvironment/build/confirmGoal"
      } else if (item.kind === 11) {
        path = "/buildEnvironment/environment/project"
      }else if (item.kind == 13){
          path = "/meeting/management/queryAgenda"
      }else if (item.kind == 14){//会议纪要详情
          path = "/meeting/management/editMeetingSummary"
      }else if(item.kind == 15 || item.kind == 16){
          path = item.remark;
      }
      let id = item.id;
        if(item.kind == 13){
            this.$router.push({
                "path": path,
                "query": {"id": item.remark}
            })
        }else if (item.kind == 14) {
            this.$router.push({
                "path": path,
                "query": {"id": item.remark, onlyRead: '1'}
            })
        }  else if (item.kind == 15 || item.kind == 16) {
            this.$router.push({
                "path": path
            })
        } else if (item.kind !== 7) {
        this.$router.push({
          "path": path,
          "query": {"id": id, hidden: isHidden}
        })
      } else {
        let data = item.remark;
        let dataArr = data.split(',');
        let dataId = dataArr[0].split(':')[1]
        this.$router.push({
          "path": path,
          "query": {"id": dataId, detailFlag: '1'}
        })
      }
    },
    //查看成果详情
    navAchieDisplay(item) {
      const path = "/sel/selDeclareInfo/detail"
      const id = item.selDeclareInfo.id;
      this.$router.push({
        "path": path,
        "query": {
          id,
          releaseFlag: '1'
        }
      })
    },
    navRouter(type) {
      if (type === 1) {
          if(this.perms.indexOf("sel:selNotice:list") >= 0 || this.$store.state.user.name=='admin'){
              this.$router.push({
                  path: '/msgSelNotice',
                  query: {
                      tabIndex: '2'
                  }
              })
          }
      } else if (type === 2) {
          if(this.perms.indexOf("achie:achieDisplayInfo:list") >= 0 || this.$store.state.user.name=='admin'){
              this.$router.push({
                  path: '/achievement/display'
              })
          }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.news-notice {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .news-notice-box {
    width: 49%;
    min-height: 260px;
    padding: 15px 10px;
    background-color: #fff;
    box-shadow: 5px 5px 5px 0 #eaeaea;
    .top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #eaeaea;
      padding: 10px 0;
      .text {
        color: #000;
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
      }
      .more {
        color: #666;
        font-size: 14px;
        line-height: 14px;
        padding-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        & > span:nth-of-type(2) {
          margin: 0 0 2px 2px;
        }
      }
    }
    .container {
      width: 100%;
      display: flex;
      flex-direction: column;
      .item-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        cursor: pointer;
        .text {
          width: 76%;
          color: #000;
          font-size: 18px;
          line-height: 18px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .new {
          font-size: 16px;
          font-style: italic;
          color: red;
          margin-right: auto;
        }
        .date {
          width: 17%;
          text-align: right;
          color: #666;
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
