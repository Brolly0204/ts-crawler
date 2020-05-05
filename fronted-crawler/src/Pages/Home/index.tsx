import React, { useState, useEffect, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { Space, Card, Button, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/lines'
import moment from 'moment'
import request from '../../request'
import './style.css'

// interface SeriesItem {
//   name: string,
//   type: string,
//   stack?: string,
//   data: number[]
// }

// type Series = SeriesItem[]

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<responseResult.CourseData>({})
  const [showData, setShowData] = useState(false)

  useEffect(() => {
    request.get('/api/islogin').then(res => {
      const data: responseResult.islogin = res.data
      if (data) {
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    }).finally(() => {
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    request.get('/api/showData').then(res => {
      const data: responseResult.showData = res.data
      if (data) {
        setData(data)
      }
    })
  }, [showData])

  const handleLogout = useCallback(() => {
    request.get('/api/logout').then(res => {
      const data: responseResult.logout = res.data
      if (data) {
        setIsLogin(false)
      }
    })
  }, [])

  const handleCrawlerClick = useCallback(() => {
    request.get('/api/getData').then(res => {
      const data: responseResult.getData = res.data
      if (data) {
        message.success('爬取成功！')
        setShowData((state) => !state)
      } else {
        message.error('爬取失败！')
      }
    })
  }, [])

  const getOption: () => echarts.EChartOption = useCallback(() => {

    // title
    const courseTitles: string[] = []
    // time
    const courseTimes: string[] = []
    // course
    const courses: { [key: string]: number[] } = {}
    // series
    const series: echarts.EChartOption.Series[] = []

    for (let key in data) {
      const item: responseResult.CourseItem[] = data[key]
      const time = moment(Number(key)).format('MM-DD HH:mm')
      courseTimes.push(time)
      item.forEach(({ title, count }) => {
        if (!courseTitles.includes(title)) {
          courseTitles.push(title)
        }
        courses[title] = courses[title] ? courses[title] : []
        courses[title].push(count)
      })

    }
    for (let k in courses) {
      series.push({
        name: k,
        type: 'line',
        data: courses[k]
      })
    }
    console.log(courses)
    return {
      title: {
        text: '在线人数'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: courseTitles
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: courseTimes
      },
      yAxis: {
        type: 'value'
      },
      series: series
    };

  }, [data])

  if (isLogin && loaded) {
    return (
      <div className="home-page">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card style={{ width: 300, margin: "0 auto" }}>
            <Space size={"middle"}>
              <Button type="primary" onClick={handleCrawlerClick}>爬取</Button>
              <Button type="primary" onClick={handleLogout}>登出</Button>
            </Space>
          </Card>
          <ReactEcharts option={getOption()} />
        </Space>
      </div>
    )
  } else if (loaded) {
    return <Redirect to="/login" />
  }
  return null
}

export default Home
