export interface Publish {
  tabType: string;
  manifestName: string;
  schedulePlanner: string;
  scheduledData: ScheduledData;
}

export interface ScheduledData {
  everyHour: string;
  selectedStartTime: TimeStamp;
  //selectedEndTime: TimeStamp;
  selectedstartDate: Date;
  selectedEndDate: Date;
  repeatEvery: string;
  onDay: string;
  repeatOnThe: string;
  repeatInaMonth: string;
  selectedTime: TimeStamp;
}

export interface TimeStamp {
  hours: number;
  minutes: number;
  amorpm: string;
}
