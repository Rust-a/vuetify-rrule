<template>
  <v-select
    v-model="byWeekDay"
    :label="$t('recurrence.weekdays.title')"
    multiple
    :items="weekDays"
    clearable
    chips
    :return-object="false"
  />
</template>
<script>
export default {
  name: 'WeekDaysComponent',
  props: {
    modelValue: {type: Array, default: () => []},
    weekDays: {type: Array, required: true}
  },
  emits: ['update:modelValue'],
  data () {
    return {
      byWeekDay: []
    }
  },
  watch: {
    byWeekDay(value) {
      value.sort();
      this.$emit('update:modelValue', value);
    }
  },
  mounted() {
    this.byWeekDay = this.modelValue ?? []
  },
}
</script>
