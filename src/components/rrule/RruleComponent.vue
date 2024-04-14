<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    height="auto"
  >
    <v-card>
      <v-toolbar :title="$t('recurrence.dialog.title')">
        <v-spacer />
        <v-icon @click="dialog=false">
          mdi-close
        </v-icon>
      </v-toolbar>
      <v-card-item>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
            >
              <p class="text-md-center">
                {{ freqText }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="4"
              class="col-md-6"
            >
              <v-text-field
                v-model="dateStart"
                :label="$t('recurrence.start.title')"
                type="datetime-local"
                style="max-width: 220px"
              />
            </v-col>
            <v-col
              cols="8"
              class="col-md-6"
            >
              <until-component
                :rule-model="ruleModel"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex fill-height align-center justify-center">
                <v-btn-toggle
                  v-model="frequency"
                  divided
                  variant="outlined"
                  rounded
                >
                  <v-btn
                    v-for="item in freqTypes"
                    :key="item.value"
                  >
                    {{ item.title }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="4"
            >
              <v-text-field
                v-model="interval"
                type="number"
                style="max-width: 80px"
                :label="$t('recurrence.interval.title')"
              />
            </v-col>
            <v-col
              cols="8"
            >
              <week-days-component
                v-if="ruleModel.getRRule().options.freq === Frequency.WEEKLY"
                v-model="byWeekDay"
                :week-days="weekDays"
                @update:model-value="touchWeekDays"
              />
              <month-days-component
                v-if="ruleModel.getRRule().options.freq === Frequency.MONTHLY"
                :rule-model="ruleModel"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>
                  {{ $t('First occurrences (max: 5)') }}
                </v-card-title>
                <v-card-text>
                  <v-chip
                    v-for="(day, key) in freqNextEvents"
                    :key="key"
                  >
                    {{ day.toLocaleString() }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col class="d-flex">
              <v-spacer />
              <v-btn
                color="success"
                variant="flat"
                @click="save"
              >
                {{ $t('main.save') }}
              </v-btn>
              <v-btn
                color="secondary"
                variant="flat"
                @click="dialog=false"
              >
                {{ $t('main.cancel') }}
              </v-btn>
              <v-spacer />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card-item>
    </v-card>
  </v-dialog>
  <v-row>
    <v-col cols="11">
      {{ freqTextOrig }}
    </v-col>
    <v-col cols="1">
      <v-icon @click="dialog=true">
        mdi-pencil
      </v-icon>
    </v-col>
  </v-row>
</template>
<script>
import {Frequency, RRule} from "rrule";
import moment from "moment";
import MonthDaysComponent from "@/components/rrule/components/MonthDaysComponent.vue";
import WeekDaysComponent from "@/components/rrule/components/WeekDaysComponent.vue";
import UntilComponent from "@/components/rrule/components/UntilComponent.vue";
import {RRuleModel} from "@/components/rrule/rrule_model";

export default {
  name: "RruleComponent",
  components: {MonthDaysComponent, WeekDaysComponent, UntilComponent},
  props: {
    modelValue: {
      type: String,
      default: undefined,
    }
  },
  emits: ['update:modelValue'],
  setup() {

  },

  data() {
    const weekDays = [
          {
            value: RRule.MO.weekday,
            title: moment().weekday(1).format('dddd'),
            object: RRule.MO,
          },
          {
            value: RRule.TU.weekday,
            title: moment().weekday(2).format('dddd'),
            object: RRule.TU,
          },
          {
            value: RRule.WE.weekday,
            title: moment().weekday(3).format('dddd'),
            object: RRule.WE,
          },
          {
            value: RRule.TH.weekday,
            title: moment().weekday(4).format('dddd'),
            object: RRule.TH,
          },
          {
            value: RRule.FR.weekday,
            title: moment().weekday(5).format('dddd'),
            object: RRule.FR,
          },
          {
            value: RRule.SA.weekday,
            title: moment().weekday(6).format('dddd'),
            object: RRule.SA,
          },
          {
            value: RRule.SU.weekday,
            title: moment().weekday(7).format('dddd'),
            object: RRule.SU,
          },
        ];
    const freqTypes =  [
      {
        value: RRule.YEARLY,
        title: this.$t('recurrence.freq.yearly')
      },
      {
        value: RRule.MONTHLY,
        title: this.$t('recurrence.freq.monthly')
      },
      {
        value: RRule.WEEKLY,
        title: this.$t('recurrence.freq.weekly')
      },
      {
        value: RRule.DAILY,
        title: this.$t('recurrence.freq.daily')
      },
    ]
    return {
      weekDays: weekDays,
      freqTypes: freqTypes,
      ruleModel: undefined,
      dateStart: undefined,
      frequency: undefined,
      byWeekDay: undefined,
      frozen: false,
      recursionCount: 0,
      ruleData: {
        str: "",
        text: "",
        textOrig: undefined,
        events: [],
      },
      interval: undefined,
      dialog: false
    }
  },
  computed: {
    Frequency() {
      return Frequency
    },
    freqString() {
      return this.ruleData.str
    },
    freqText() {
      return this.ruleData.text
    },
    freqTextOrig() {
      return this.ruleData.textOrig
    },
    freqNextEvents() {
      return this.ruleData.events
    }

  },
  watch: {
    interval(value, oldValue) {
      if (!oldValue || value === oldValue) {
        return
      }
      this.ruleModel.setInterval(value)
    },
    dateStart(value) {
      this.ruleModel.setStartDate(moment(value).toDate())
    },
    frequency(value, oldValue) {
      this.ruleModel.setFrequency(value)
    },
    byWeekDay(value, oldValue) {
      if (value) {
        this.ruleModel.setByWeekDay(value)
      }
    },
    'ruleModel.version'(value, oldValue) {
      if (!oldValue) {
        return
      }
      this.rebuildRuleData()
    },
  },

  created() {
    const rrule = RRule.fromString(this.modelValue ?? this.getDefaultRRuleString())
    this.ruleModel = new RRuleModel(rrule);
    const dateStart = moment(rrule.options.dtstart);
    this.ruleModel.setStartDate(dateStart.toDate())
    this.dateStart = dateStart.format('YYYY-MM-DD\THH:mm')

    this.frequency = rrule.options.freq
    this.interval = rrule.options.interval
    this.byWeekDay = rrule.options.byweekday

    this.rebuildRuleData()
  },
  methods: {
    touchWeekDays(value) {
      this.ruleModel.setByWeekDay(value)
    },
    rebuildRuleData() {
      this.ruleData.str = this.ruleModel.getRRule().toString();
      this.ruleData.text = this.ruleModel.getRRule().toText();
      this.ruleData.events = this.ruleModel.getRRule().all((d, len) => (len < 5));
      this.ruleData.textOrig = this.ruleData.textOrig ?? this.ruleData.text
    },
    getDefaultRRuleString() {
      const startDay = moment().add(1, 'M').startOf('month')
          .format("YYYYMMDD")
      return `DTSTART:${startDay}T080000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=1;COUNT=5;WKST=MO`
    },
    save() {
      this.ruleData.textOrig = this.ruleModel.getRRule().toText();
      this.$emit('update:modelValue', this.ruleData.str);
    }
  }
}
</script>
