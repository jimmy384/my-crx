<script setup>
import { onMounted, ref } from 'vue'  ;
import HelloWorld from './components/HelloWorld.vue'
import viteLogo from './assets/vite.svg';
import vueLogo from './assets/vue.svg';
const viteLogoUrl = chrome.runtime.getURL(viteLogo);
const vueLogoUrl = chrome.runtime.getURL(vueLogo);
const backendUrl = ref('');

onMounted(() => {
  // 挂载后读取持久化的设置
  chrome.runtime.sendMessage({ action: "getConfig" }, response => {
    console.log("获取配置:", response)
    backendUrl.value = response.backendUrl
  })
})

/**
 * 保存设置
 */
function saveSettings() {
  const message = {
    action: "saveConfig", settings: { backendUrl: backendUrl.value }
  }
  chrome.runtime.sendMessage(message, response => {
    console.log("保存设置结果:", response)
  });
}

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img :src="viteLogoUrl" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img :src="vueLogoUrl" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue3" />
  <p>{{ backendUrl }}</p>
  <input type="text" v-model="backendUrl" placeholder="backend url" />
  <button @click="saveSettings">保存</button>
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
