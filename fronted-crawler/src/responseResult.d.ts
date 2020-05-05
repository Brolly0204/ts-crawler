declare namespace responseResult {
  interface CourseItem {
    title: string
    count: number
  }

  interface CourseData {
    [propName: string]: CourseItem[]
  }

  type getData = boolean
  type islogin = boolean
  type login = boolean
  type logout = boolean
  type showData = CourseData
}