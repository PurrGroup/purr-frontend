<template>
  <div class="admin-dashboard-wrapper">
    <div id="admin-dashboard">
      <div class="row first-row">
        <div class="col first-col"><statistic-dashboard /></div>
        <div class="col second-col"><comment-dashboard /></div>
      </div>
      <div class="row second-row">
        <div class="col first-col"><article-dashboard /></div>
        <div class="col second-col"><commit-dashboard /></div>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticDashboard from '../../../components/Dashboard/StatisticDashboard';
import CommentDashboard from '../../../components/Dashboard/CommentDashboard';
import ArticleDashboard from '@/components/Dashboard/ArticleDashboard';
import CommitDashboard from '../../../components/Dashboard/CommitDashboard';
export default {
  components: {
    ArticleDashboard,
    StatisticDashboard,
    CommentDashboard,
    CommitDashboard
  }
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}

.first-col {
  flex: 1 1 auto;
  padding-right: 12px;
  margin-right: auto;
}

.second-col {
  flex: 0 0 348px;
  padding-left: 12px;
  margin-left: auto;
}

.second-row {
  margin-top: 24px;
}
</style>
