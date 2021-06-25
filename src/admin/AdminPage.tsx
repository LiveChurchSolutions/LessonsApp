import React from "react";
import { DisplayBox, ApiHelper, Loading, ProgramInterface, StudyInterface, LessonInterface, ProgramEdit, StudyEdit, LessonEdit } from "./components"
import { Link } from "react-router-dom"
import { Row, Col } from "react-bootstrap";


export const AdminPage = () => {
  const [programs, setPrograms] = React.useState<ProgramInterface[]>(null);
  const [studies, setStudies] = React.useState<StudyInterface[]>(null);
  const [lessons, setLessons] = React.useState<LessonInterface[]>(null);
  const [editProgram, setEditProgram] = React.useState<ProgramInterface>(null);
  const [editStudy, setEditStudy] = React.useState<StudyInterface>(null);
  const [editLesson, setEditLesson] = React.useState<LessonInterface>(null);

  const loadData = () => {
    ApiHelper.getAnonymous("/programs/provider/1", "LessonsApi").then((data: any) => { setPrograms(data); });
    ApiHelper.get("/studies", "LessonsApi").then((data: any) => { setStudies(data); });
    ApiHelper.get("/lessons", "LessonsApi").then((data: any) => { setLessons(data); });
  };

  React.useEffect(loadData, []);

  const clearEdits = () => { setEditProgram(null); setEditStudy(null); setEditLesson(null); }
  const handleUpdated = () => { loadData(); setEditProgram(null); setEditStudy(null); setEditLesson(null); };

  const getRows = () => {
    const result: JSX.Element[] = [];
    programs.forEach(p => {
      result.push(<tr className="programRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditProgram(p) }}>{p.name}</a></td>
      </tr>);
      getStudies(p.id).forEach(i => result.push(i));
    });
    return result;
  }

  const getStudies = (programId: string) => {
    const result: JSX.Element[] = [];
    studies?.forEach(s => {
      result.push(<tr className="studyRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditStudy(s) }}>{s.name}</a></td>
      </tr>);
      getLessons(s.id).forEach(i => result.push(i));
    });
    return result;
  }

  const getLessons = (studyId: string) => {
    const result: JSX.Element[] = [];
    lessons?.forEach(l => {
      result.push(<tr className="lessonRow">
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); clearEdits(); setEditLesson(l) }}>{l.name}</a></td>
      </tr>);
    });
    return result;
  }

  const getTable = () => {
    if (programs === null) return <Loading />
    else return (
      <table className="table table-sm" id="adminTree">
        <tbody>
          {getRows()}
        </tbody>
      </table>
    )
  }

  const getSidebar = () => {
    const result: JSX.Element[] = [];
    if (editProgram) result.push(<ProgramEdit program={editProgram} updatedCallback={handleUpdated} />)
    else if (editStudy) result.push(<StudyEdit study={editStudy} updatedCallback={handleUpdated} />)
    else if (editLesson) result.push(<LessonEdit lesson={editLesson} updatedCallback={handleUpdated} />)
    return result;
  }

  return (<>
    <h1>Programs</h1>
    <Row>
      <Col lg={8}>
        <DisplayBox headerText="Programs" headerIcon="none" >
          {getTable()}
        </DisplayBox>
      </Col>
      <Col lg={4}>
        {getSidebar()}
      </Col>
    </Row>

  </>);
}
