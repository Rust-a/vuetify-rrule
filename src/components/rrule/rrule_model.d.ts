import {RRule} from "rrule";
import {Options} from "rrule/dist/esm/types";

/**
 *
 * @param {RRule} rrule
 * @constructor
 */
export declare class RRuleModel {
    rrule: RRule

    constructor(rrule?: RRule);
    static fromString(text: string): RRuleModel;

    getRRule(): RRule
    setStartDate(value: Date): void
    setInterval(value: number): void
    setFrequency(value: number): void
    setCount(value: number): void
    setUntil(value: Date | null): void
    setByMonth(value: number[] | null): void
    setByMonthDay(value: number[] | null): void
    setByWeekDay(value: number[] | null): void
    setByNWeekDay(value: number[][] | null): void
    setByWeekNo(value: number[] | null): void
    setByHour(value: number[] | null): void
    setBySecond(value: number[] | null): void
    setNeverEnd(): void
}