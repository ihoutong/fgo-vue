<template>
  <div class="col-sm">
    {{display_name}}
    <select v-model="dropdown_value">
      <option v-for="(value, key) in values" v-bind:value="value">{{key}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'CardOptions',
  props: {
    display_name: String,
    values: Object,
  },
  data() {
    return {
      dropdown_value: '',
    };
  },
  watch: {
    dropdown_value(val) {
      this.$emit('input', val);
    },
  },
};
</script>
