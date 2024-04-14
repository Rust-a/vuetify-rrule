import {Frequency, RRule} from "rrule";

const VersionedRRule = class {
    rrule = undefined;
    version = undefined;

    constructor(rrule, version) {
        this.rrule = rrule;
        this.version = version;
    }
}

/**
 *
 * @param {RRule} rrule
 * @constructor
 */
const RRuleModel = class {

    version = 1;
    ruleDuplicate = null;

    constructor(rrule) {
        this.rrule = rrule;
        this.ruleDuplicate = new VersionedRRule(this.rrule.clone(), this.version)
    }


    static fromString(str) {
        return new RRuleModel(RRule.parseString(str) || undefined);
    }
    static smartCopy(rrule) {
        const oldValue = {...rrule.options}
        const newValue = new RRule(rrule.options);
        if (rrule.options.freq === Frequency.MONTHLY) {
            if (!!oldValue.bynweekday?.length) {
                newValue.options.bymonthday = null
                newValue.origOptions.bymonthday = null
                newValue.options.bynweekday = oldValue.bynweekday
                newValue.origOptions.bynweekday = oldValue.bynweekday
            }
        }

        return newValue
    }

    getRRule() {
        let x = this.ruleDuplicate.version;
        if (this.ruleDuplicate.version !== this.version) {
            this.ruleDuplicate = {
                version: this.version,
                rrule: RRuleModel.smartCopy(this.rrule),
            }
        }
        return this.ruleDuplicate.rrule;
    }
    setStartDate(value) {
        if (this.rrule.options.dtstart.valueOf() === value.valueOf()) {
            return
        }

        this.rrule.options.dtstart = value
        if (this.rrule.options.freq === Frequency.YEARLY) {
            this.rrule.options.bymonth = value.getMonth()+1
            this.rrule.options.bymonthday = value.getDate()
        }
        this.version++
    }
    setInterval(value) {
        if (this.rrule.options.interval === value) {
            return
        }
        this.rrule.options.interval = value
        this.version++
    }
    setFrequency(value) {
        if (this.rrule.options.freq === value) {
            return
        }
        if (value !== Frequency.MONTHLY) {
            this.rrule.options.bynweekday = [];
            this.rrule.options.bymonthday = [];
        }
        if (value !== Frequency.WEEKLY) {
            this.rrule.options.byweekday = [];
            this.rrule.origOptions.byweekday = [];
        }
        if (value !== Frequency.YEARLY) {
            this.rrule.options.bymonth = [];
        } else {
            this.rrule.options.bymonth = [this.rrule.options.dtstart.getMonth()+1]
            this.rrule.origOptions.bymonth = [this.rrule.options.dtstart.getMonth()+1]
            this.rrule.options.bymonthday = [this.rrule.options.dtstart.getDate()]
            this.rrule.origOptions.bymonthday = [this.rrule.options.dtstart.getDate()]
        }

        this.rrule.options.freq = value
        this.version++
    }
    setCount(value) {
        if (this.rrule.options.count === value) {
            return
        }
        this.rrule.options.until = null
        this.rrule.origOptions.until = null
        this.rrule.options.count = value
        this.version++
    }
    setUntil(value) {
        if (this.rrule.options.until === value) {
            return
        }
        this.rrule.options.count = null
        this.rrule.origOptions.count = null
        this.rrule.options.until = value
        this.version++
    }
    setByMonth(value) {
        if (this.rrule.options.bymonth === value) {
            return
        }
        this.rrule.options.bymonth = value
        this.version++
    }
    setByMonthDay(value) {
        if (this.rrule.options.bymonthday === value) {
            return
        }
        this.rrule.options.byweekday = []
        this.rrule.origOptions.byweekday = []
        this.rrule.options.bymonthday = value
        this.rrule.origOptions.bymonthday = value
        this.version++
    }
    setByWeekDay(value) {
        if (this.rrule.options.byweekday === value) {
            return
        }
        
        this.rrule.options.bymonthday = []
        this.rrule.origOptions.bymonthday = []
        this.rrule.options.byweekday = value
        this.rrule.origOptions.byweekday = value
        this.version++
    }
    setByNWeekDay(value) {
        if (this.rrule.options.bynweekday === value) {
            return
        }
        
        this.rrule.options.bymonthday = []
        this.rrule.origOptions.bymonthday = []
        this.rrule.options.bynweekday = value
        this.rrule.origOptions.bynweekday = value
        this.version++
    }
    setByWeekNo(value) {
        if (this.rrule.options.byweekno === value) {
            return
        }
        
        this.rrule.options.byweekno = value
        this.version++
    }
    setByHour(value) {
        if (this.rrule.options.byhour === value) {
            return
        }
        
        this.rrule.options.byhour = value
        this.version++
    }
    setByMinute(value) {
        if (this.rrule.options.byminute === value) {
            return
        }
        
        this.rrule.options.byminute = value
        this.version++
    }
    setBySecond(value) {
        if (this.rrule.options.bysecond === value) {
            return
        }
        
        this.rrule.options.bysecond = value
        this.version++
    }
    setNeverEnd() {
        
        this.rrule.options.count = null;
        this.rrule.options.until = null;
        this.version++
    }

};

export { RRuleModel }