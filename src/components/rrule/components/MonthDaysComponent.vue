<template>
  <v-row>
    <v-col>
      <v-select
        v-model="mode"
        :items="modeItems"
      />
    </v-col>
    <v-col v-if="mode===MODE_MONTHDAY">
      <v-select
        v-model="byMonthDay"
        :label="$t('recurrence.month_days.day_of_month')"
        :items="dayNumberItems"
        multiple
        chips
      />
    </v-col>
    <v-col v-if="mode===MODE_WEEKDAY">
      <v-select
        v-model="byNWeekDay"
        :label="$t('recurrence.month_days.mode_weekday')"
        :items="weekDayItems"
        chips
        return-object
      />
    </v-col>
  </v-row>
</template>
<script>
import moment from "moment/moment";
import {Weekday} from "rrule";
import {RRuleModel} from "@/components/rrule/rrule_model";

export default {
  name: "MonthDaysComponent",
  props: {
    ruleModel: {type: RRuleModel, required: true}
  },
  setup() {
      const MODE_MONTHDAY = 'day';
      const MODE_WEEKDAY = 'weekday';

      const dayNumberItems = [];
      for(let i = 1; i <= 31; i++){
        dayNumberItems.push({title:i, value:i});
      }
      return {
        MODE_MONTHDAY, MODE_WEEKDAY, dayNumberItems
      }
  },
  data() {
    const numberNames = {
      "1": this.$t('recurrence.number-name.1'),
      "2": this.$t('recurrence.number-name.2'),
      "3": this.$t('recurrence.number-name.3'),
      "4": this.$t('recurrence.number-name.4'),
      "-1": this.$t('recurrence.number-name.-1'),
      "-2": this.$t('recurrence.number-name.-2'),
      "-3": this.$t('recurrence.number-name.-3'),
      "-4": this.$t('recurrence.number-name.-4'),
    };
    return {
      numberNames: numberNames,
      mode: undefined,
      dayNumber: undefined,
      modeItems: [
        {
          value: this.MODE_MONTHDAY,
          title: this.$t('recurrence.month_days.mode_day'),
        },
        {
          value: this.MODE_WEEKDAY,
          title: this.$t('recurrence.month_days.mode_weekday'),
        },
      ],
      weekDayItems: [],
      byNWeekDay: undefined,
      byMonthDay: undefined,
    }
  },
  watch: {
    mode(value) {
      if (value === this.MODE_WEEKDAY) {
        this.prepareWeekDaysItems();
        this.setByWeekDay();
      }
      if (value === this.MODE_MONTHDAY) {

      }

    },
    byMonthDay(value) {
      this.ruleModel.setByMonthDay(value)
    },
    byNWeekDay(value) {
      if (value) {
        this.ruleModel.setByWeekDay(value.realValue)
      }
    },
  },
  created() {
    if (this.ruleModel.getRRule().options.bynweekday && this.ruleModel.getRRule().options.bynweekday.length) {
      this.prepareWeekDaysItems()
      this.setByWeekDay();
      this.mode = this.MODE_WEEKDAY
    } else {
      if (!this.ruleModel.getRRule().options.bymonthday.length) {
        this.ruleModel.setByMonthDay([this.ruleModel.getRRule().options.dtstart.getDate()])
      }
      this.byMonthDay = this.ruleModel.getRRule().options.bymonthday
      this.mode = this.MODE_MONTHDAY
    }
  },
  methods: {
    prepareWeekDaysItems() {
      this.weekDayItems.length = 0
      const data = this.calculateWeekDay();
      if (data.weekDayInMonth < 5) {
        this.weekDayItems.push({
          value: data.weekDayInMonth,
          title: this.numberNames[data.weekDayInMonth] + ' ' + data.weekdayName,
          realValue: new Weekday(data.weekdayNumber, data.weekDayInMonth),
        })
      }
      if (data.weekDayInMonthReverse > -5) {
        this.weekDayItems.push({
          value: data.weekDayInMonthReverse,
          title: this.numberNames[data.weekDayInMonthReverse] + ' ' + data.weekdayName,
          realValue: new Weekday(data.weekdayNumber, data.weekDayInMonthReverse)
        })
      }
    },
    calculateWeekDay() {
      let x = moment(this.ruleModel.getRRule().options.dtstart)
      const weekdayNumber = x.weekday() - 1;
      const weekdayName = x.format('dddd')
      const weekDayInMonth = this.numberWeakDayInMonth(x);
      const weekDayInMonthReverse = this.numberWeakDayInMonthReverse(x);

      return {
        weekdayNumber, weekDayInMonth, weekDayInMonthReverse, weekdayName
      }
    },
    numberWeakDayInMonth(value) {
      const month = value.month()
      let copyValue = moment(value)
      for (let i=0; i<5; i++) {
        copyValue.subtract(moment.duration(1, 'week'))
        if (copyValue.month() !== month) {
          return i+1;
        }
      }
    },
    numberWeakDayInMonthReverse(value) {
      const month = value.month()
      let copyValue = moment(value)
      for (let i=0; i<5; i++) {
        copyValue.add(moment.duration(1, 'week'))
        if (copyValue.month() !== month) {
          return -(i+1);
        }
      }
    },
    setByWeekDay() {
      const weekDay = this.ruleModel.getRRule().options?.bynweekday
          ? this.ruleModel.getRRule().options?.bynweekday[0]
          : null;
      if (weekDay) {
        this.byNWeekDay = this.weekDayItems.find(item => {
          return JSON.stringify(item.realValue) === JSON.stringify(weekDay)
        });
      } else {
        this.byNWeekDay = this.weekDayItems[0];
      }

    }
  },
}
</script>
<style scoped>

</style>
