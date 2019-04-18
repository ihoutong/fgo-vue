<template>
  <img style="margin-right: -40px;" :src="require(`../assets/images/cmdCard/${command}.png`)" alt="">
</template>

<script>
export default {
  name: 'CommandCard',
  props: ['command'],
};
</script>
