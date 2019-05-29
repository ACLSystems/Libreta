export class CourseModel  {
  constructor(
    public titleCourse: string
  ) {

  }
}

export class GradeTask {
  constructor(
    public id: number,
    public grade: number,
    public label: any,
    public indexTask: number
  ) {

  }
}
