<script setup>
import { onMounted, ref } from 'vue'
import dispatcher from './common/content/dispatcher'

const backendUrl = ref('');

onMounted(() => {
  // 挂载后读取持久化的设置
  dispatcher.getConfig().then(response => {
    console.log("获取配置:", response)
    backendUrl.value = response.backendUrl
  })
})

/**
 * 保存设置
 */
function saveSettings() {
  const settings = { backendUrl: backendUrl.value }
  dispatcher.saveConfig(settings).then(response => {
    console.log("保存设置结果:", response)
  })
}
</script>

<template>
  <div>
    <span>后台地址:</span><input type="text" v-model="backendUrl" />
    <button @click="saveSettings">保存</button>
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
