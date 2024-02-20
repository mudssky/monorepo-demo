import clsx from 'clsx'
import dayjs, { Dayjs } from 'dayjs'
import React, { CSSProperties, ReactNode, useState } from 'react'
import LocaleContext from './LocaleContext'
import Header from './components/Header'
import MonthCalendar from './components/MonthCalendar'
import './index.scss'

export interface CalendarProps {
  value: Dayjs
  style?: CSSProperties
  className?: string | string[]
  // 定制日期渲染
  dateRender?: (currentDate: Dayjs) => ReactNode
  // 定制日期单元格
  dateInnerContent?: (currentDate: Dayjs) => ReactNode
  // 国际化相关
  locale?: string
  onChange?: (date: Dayjs) => void
}

function Calendar(props: CalendarProps) {
  const { style, value, className, locale, onChange } = props
  const classNames = clsx('calendar', className)
  const [currentDate, setCurrentDate] = useState<Dayjs>(value)

  const [curMonth, setCurMonth] = useState<Dayjs>(value)

  function changeDate(date: Dayjs) {
    setCurrentDate(date)
    setCurMonth(date)
    onChange?.(date)
  }
  function selectHandler(date: Dayjs) {
    changeDate(date)
  }

  function prevMonthHandler() {
    setCurMonth(curMonth.subtract(1, 'month'))
  }

  function nextMonthHandler() {
    setCurMonth(curMonth.add(1, 'month'))
  }

  function todayHandler() {
    const date = dayjs(Date.now())
    changeDate(date)
  }
  return (
    <LocaleContext.Provider
      value={{
        locale: locale || navigator.language,
      }}
    >
      <div className={classNames} style={style}>
        <Header
          curMonth={curMonth}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
          todayHandler={todayHandler}
        ></Header>
        <MonthCalendar
          {...props}
          value={currentDate}
          curMonth={curMonth}
          selectHandler={selectHandler}
        ></MonthCalendar>
      </div>
    </LocaleContext.Provider>
  )
}

export default Calendar
