<template>
  <v-row>
    <v-col cols="5">
      <v-select
        v-model="endType"
        :items="ends"
        :label="$t('recurrence.end.title')"
        outlined
        dense
      />
    </v-col>
    <v-col cols="7">
      <v-text-field
        v-if="endType === MODE_COUNT"
        v-model="count"
        :label="$t('recurrence.count.title')"
        type="number"
        outlined
        dense
        style="max-width: 220px"
      />
      <v-text-field
        v-if="endType === MODE_UNTIL"
        v-model="until"
        :label="$t('recurrence.until.title')"
        type="date"
        style="max-width: 220px"
      />
    </v-col>
  </v-row>
</template>
<script>
import moment from "moment";
import {RRuleModel} from "@/components/rrule/rrule_model";

export default {
  name: "UntilComponent",
  props: {
    ruleModel: {type: RRuleModel, required: true}
  },
  setup() {
    const MODE_UNTIL = 'on'
    const MODE_COUNT = 'after'
    const MODE_NEVER = 'never'
    return {
      MODE_UNTIL, MODE_COUNT, MODE_NEVER
    }
  },
  data() {
    return {
      menu: false,
      endType: undefined,
      ends: [this.MODE_UNTIL, this.MODE_COUNT, this.MODE_NEVER],
      until: null,
      count: null
    }
  },
  watch: {
    count(value) {
      this.setCount(value)
    },
    until(value) {
      this.setUntil(moment.utc(value, 'YYYY-MM-DD').toDate())
    },
    endType(value, oldValue) {
      if (oldValue === undefined) {
        return
      }
      switch (value) {
        case this.MODE_NEVER:
          this.setNever();
          break;
        case this.MODE_COUNT:
          this.setCount();
          break;
        case this.MODE_UNTIL:
          this.setUntil();
      }
    }
  },
  created() {
    if (this.ruleModel.getRRule().options.until) {
      this.setUntil(this.ruleModel.getRRule().options.until)
      this.endType = this.MODE_UNTIL
    } else if (this.ruleModel.getRRule().options.count){
      this.setCount(this.ruleModel.getRRule().options.count)
      this.endType = this.MODE_COUNT
    } else {
      this.endType = this.MODE_NEVER
    }
  },
  methods: {
    setUntil(value = null) {
      let until;
      if (null !== value) {
        until = moment(this.ruleModel.getRRule().options.until)
        this.until = until.format('YYYY-MM-DD');
      } else{
        until = this.until
            ? moment(this.until)
            : moment().add(3, "month")
        this.until = until.format('YYYY-MM-DD')
      }
      this.ruleModel.setUntil(until.toDate())
    },
    setCount(value = null) {
      if (null !== value) {
        this.count = value;
      } else {
        this.count = 20;
      }
      this.ruleModel.setCount(this.count);
    },
    setNever() {
      this.ruleModel.setNeverEnd();
    }
  },
}
</script>
<style scoped>

</style>
