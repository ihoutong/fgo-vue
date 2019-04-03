<template>
  <thead>
    <tr>
      <th v-for="(value, key) in displayFields" :key="key" @click="sortList(key)" class="pointer">{{value}}</th>
    </tr>
  </thead>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    displayFields: Object,
  },
  methods: {
    sortList(key) {
      this.$emit('sort', key);
    },
  },
};

</script>