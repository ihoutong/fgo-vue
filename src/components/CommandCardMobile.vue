<template>
  <span :style="{backgroundColor: '#'+color}">{{name}}</span>
</template>

<script>
export default {
  name: 'CommandCardMobile',
  props: ['command'],
  computed: {
    name() {
      const arr = ['A', 'B', 'Q'];
      return arr[this.command - 1];
    },
    color() {
      const arr = ['153E90', '851110', '1F690D'];
      return arr[this.command - 1];
    },
  },
};
</script>

<style lang="scss" scoped>
  span {
    padding: 8px 4px;
    color: white;
  }
</style>
