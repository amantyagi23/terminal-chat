import moment from "moment-timezone";

export class DateUtils {
  /**
   * Convert a date to a specified timezone
   * @param date - ISO string or Date object
   * @param timezone - e.g., "Asia/Kolkata", "UTC"
   */
  static toTimezone(date: Date | string, timezone: string): string {
    return moment(date).tz(timezone).format("YYYY-MM-DD HH:mm:ss z");
  }

  /**
   * Get readable date like "June 18, 2025 (Wednesday)"
   * @param date - ISO string or Date object
   */
  static getReadableDate(date: Date | string): string {
    return moment(date).format("MMMM D, YYYY (dddd)");
  }

  /**
   * Check if date is valid
   */
  static isValid(date: string | Date): boolean {
    return moment(date).isValid();
  }

  /**
   * Return breakdown: { day, month, year, time }
   */
  static getDateParts(date: Date | string) {
    const m = moment(date);
    return {
      year: m.year(),
      month: m.format("MMMM"),
      day: m.date(),
      weekday: m.format("dddd"),
      time: m.format("HH:mm:ss"),
    };
  }

  /**
   * Get ISO formatted datetime
   */
  static toISO(date: Date | string): string {
    return moment(date).toISOString();
  }

  static toDateInTimezone(date: Date | string, timezone: string): Date {
    return moment.tz(date, timezone).toDate();
  }
}
