<template>
  <div id="app">
    <report-table></report-table>
  </div>
</template>

<script>
import ReportTable from './components/ReportTable.vue';
export default {
  name: 'App',
  components: {
    ReportTable
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
