import clsx from 'clsx'
import { Dayjs } from 'dayjs'
import React, { useContext } from 'react'
import { CalendarProps } from '..'
import LocaleContext from '../LocaleContext'
import allLocales from '../locale'

interface MonthCalendarProps extends CalendarProps {
  selectHandler?: (date: Dayjs) => void
  curMonth: Dayjs
}

interface DayInfoItem {
  date: Dayjs
  isCurrentMonth: boolean
}
function getAllDays(date: Dayjs) {
  // const daysInMonth = date.daysInMonth()
  const startDate = date.startOf('month')
  // 该月起始日的星期下标
  const day = startDate.day()

  // 日历固定为6*7大小
  const daysInfo = new Array<DayInfoItem>(6 * 7)
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      isCurrentMonth: false,
    }
  }
  for (let i = day; i < daysInfo.length; i++) {
    const curDate = startDate.add(i - day, 'day')
    daysInfo[i] = {
      date: curDate,
      isCurrentMonth: curDate.month() === date.month(),
    }
  }
  return daysInfo
}
function renderDays(
  days: DayInfoItem[],
  options?: Pick<
    MonthCalendarProps,
    'dateInnerContent' | 'dateRender' | 'value' | 'selectHandler'
  >,
) {
  return (
    <div className="calendar-month-body-container">
      {days.map((item) => {
        return (
          <div
            key={item.date.toString()}
            className={clsx(
              'calendar-month-body-cell',
              !item.isCurrentMonth && 'not-current-month',
            )}
            onClick={() => options?.selectHandler?.(item.date)}
          >
            {options?.dateRender ? (
              options?.dateRender(item.date)
            ) : (
              <div className="calendar-month-body-cell-date">
                <div
                  className={clsx(
                    'calendar-month-body-cell-date-value',
                    options?.value?.format('YYYY-MM-DD') ===
                      item.date.format('YYYY-MM-DD') &&
                      'calendar-month-body-cell-date-selected',
                  )}
                >
                  {item.date.date()}
                </div>
                <div className="calendar-month-body-cell-date-content">
                  {options?.dateInnerContent?.(item.date)}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
function MonthCalendar(props: MonthCalendarProps) {
  const { dateInnerContent, dateRender, value, curMonth, selectHandler } = props
  const localeContext = useContext(LocaleContext)
  const CalendarLocale = allLocales[localeContext.locale]
  // const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekList = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const allDays = getAllDays(curMonth)
  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {CalendarLocale.week[week]}
          </div>
        ))}
      </div>
      {renderDays(allDays, {
        dateRender,
        dateInnerContent,
        value,
        selectHandler,
      })}
    </div>
  )
}

export default MonthCalendar
