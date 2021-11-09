<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script>
import { computed, defineComponent } from 'vue';
import localeEn from '@/plugins/lang/en';
import en from 'element-plus/lib/locale/lang/en';
import localeZhCn from '@/plugins/lang/zh-cn';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
  setup() {
    const ZhCn = {
      ...zhCn,
      ...localeZhCn
    };
    const En = {
      ...en,
      ...localeEn
    };
    const locale = computed(() => {
      switch (window.localStorage.getItem('lang')) {
        case 'en':
          return En;
        case 'zh-cn':
          return ZhCn;
        default:
          return ZhCn;
      }
    });

    return {
      locale
    };
  }
});
</script>

<style lang="scss"></style>
