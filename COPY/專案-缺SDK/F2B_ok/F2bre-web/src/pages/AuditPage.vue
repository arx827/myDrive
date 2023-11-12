<script setup lang="ts">
  // import { ref, reactive } from 'vue';
  // import { v4 as uuidv4 } from 'uuid';
  // import {
  //   LeftOutlined,
  //   RightOutlined,
  //   CloseCircleFilled
  // } from '@ant-design/icons-vue';

  // let activeKey = ref('1');
  // let panes = ref<{title: string; content: string; key: string; closable?: boolean}[]>([
  //   { title: '待審核', content: '待審核', key: '1', closable: false },
  //   { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  //   { title: 'Tab 3', content: 'Content of Tab 3', key: '3' },
  // ]);

  // /**
  //  * Event
  //  */

  // const onEdit = (targetKey: string | MouseEvent, action: string) => {
  //   if(action === 'add') {
  //     add();
  //   }else{
  //     remove(targetKey as string);
  //   }
  // }

  // const add = () => {
  //   activeKey.value = `newTab${uuidv4()}`;
  //   panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });
  // };

  // const remove = (targetKey: string) => {
  //   let lastIndex = 0;
  //   panes.value.forEach((pane, i) => {
  //     if (pane.key === targetKey) {
  //       lastIndex = i - 1;
  //     }
  //   });
  //   panes.value = panes.value.filter(pane => pane.key !== targetKey);
  //   if (panes.value.length && activeKey.value === targetKey) {
  //     if (lastIndex >= 0) {
  //       activeKey.value = panes.value[lastIndex].key;
  //     } else {
  //       activeKey.value = panes.value[0].key;
  //     }
  //   }
  // };

  // const prevTab = () => {
  //   const $idx = panes.value.indexOf(panes.value.find(pane => pane.key === activeKey.value));
  //   if($idx !== 0) {
  //     activeKey.value = panes.value[$idx - 1].key;
  //   }
  // }

  // const nextTab = () => {
  //   const $idx = panes.value.indexOf(panes.value.find(pane => pane.key === activeKey.value));
  //   if($idx !== panes.value.length) {
  //     activeKey.value = panes.value[$idx + 1].key;
  //   }
  // }


</script>

<template>
  auditPage
  <!-- <div class="page-container">
    <a-tabs
      v-model:activeKey="activeKey"
      type="editable-card"
      class="page__header__tabBar"
      :hideAdd="true"
      @edit="onEdit"
    >
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        {{ pane.content }}
        <template #closeIcon>
          <close-circle-filled />
        </template>
      </a-tab-pane>
      <template #leftExtra>
        <a-button class="tabs-extra-button" @click="prevTab"><left-outlined /></a-button>
      </template>
      <template #rightExtra>
        <a-button class="tabs-extra-button" @click="nextTab"><right-outlined /></a-button>
      </template>
    </a-tabs>
  </div> -->
</template>

<style lang="scss" >

</style>
