import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { LessonInterface, StudyInterface, ProgramInterface, ApiHelper, Loading, Venues } from "./components";
import { Container, Row, Col } from "react-bootstrap"

type TParams = { id?: string };

export const LessonPage = ({ match }: RouteComponentProps<TParams>) => {

  const [program, setProgram] = React.useState<ProgramInterface>(null);
  const [study, setStudy] = React.useState<StudyInterface>(null);
  const [lesson, setLesson] = React.useState<LessonInterface>(null);

  const loadData = async () => {
    const l: LessonInterface = await ApiHelper.getAnonymous("/lessons/public/" + match.params.id, "LessonsApi");
    setLesson(l);
    const s: StudyInterface = await ApiHelper.getAnonymous("/studies/public/" + l.studyId, "LessonsApi");
    setStudy(s);
    const p: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/" + s.programId, "LessonsApi");
    setProgram(p);
  };

  const checkLoadData = () => {
    loadData();
  }

  React.useEffect(checkLoadData, []);


  const getLesson = () => {
    if (!lesson) return <Loading />
    else return (<>
      <div className="text-center">
        <div className="title">{program?.name}</div>
        <h2>{study?.name}: <span>{lesson?.name}</span></h2>
      </div>
      <p>{lesson.description}</p>
      {getVideo()}
    </>);
  }


  const getVideo = () => {
    if (lesson.videoEmbedUrl) return (<div className="videoWrapper">
      <iframe width="992" height="558" src={study.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>);
    else return <Row><Col lg={{ span: 8, offset: 2 }} ><img src={lesson.image} className="img-fluid profilePic" alt={lesson.name} /><br /><br /></Col></Row >
  }


  return (
    <div className="pageSection">
      <Container>
        {getLesson()}

        <Venues lessonId={lesson?.id || ""} />
      </Container>
    </div>
  );
}
