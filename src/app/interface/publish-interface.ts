export interface Publish {
  tabType: string;
  manifestName:  string;
  schedulePlanner: string;
  hourly: Hourly;
  weekly: Weekly;
  monthly: Montly;
  yearly: Yearly;
}

export interface Hourly {
  selectedDay: string;
  selectedStartTime: TimeStamp;
  selectedEndTime: TimeStamp;
}

export interface Weekly {
    selectedstartDate: Date;
    selectedStartTime: TimeStamp;
    repeatInaWeek: string;
    selectedDay: string;
    selectedEndDate: Date;
    selectedEndTime: TimeStamp;
}

export interface Montly{
    selectedstartDate: Date;
    selectedStartTime: TimeStamp;
    repeatInaMonth: string;
    selectedDay: string;
    selectedEndDate: Date;
    selectedEndTime: TimeStamp;
}

export interface Yearly {
    selectedstartDate: Date;
    repeatInaWeek: string;
    repeatOnaDay: string;
    repeatInaMonth: string;
    selectedTime: TimeStamp;
    selectedEndDate: Date;
}

export interface TimeStamp {
    hours: number;
    minutes: number;
    amorpm: string;
};

