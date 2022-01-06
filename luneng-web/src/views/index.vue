<template>
  <div class="app-container">
    <FastEntrance />
    <upcoming />
    <news-notice />
  </div>
</template>

<script>
import FastEntrance from './home/FastEntrance'
import Upcoming from './home/Upcoming'
import NewsNotice from './home/NewsNotice'
export default {
  name: 'Index',
  components: {
    FastEntrance,
    Upcoming,
    NewsNotice
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 30px 50px 30px;
    display: flex;
    flex-direction: column;
    background-color: rgba(153, 153, 153, .1);
  }
</style>
