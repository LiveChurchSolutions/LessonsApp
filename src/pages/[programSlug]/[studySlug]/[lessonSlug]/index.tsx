import { GetStaticPaths, GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import { Layout, Venues } from "@/components";
import { ApiHelper, ProgramInterface, StudyInterface, LessonInterface, ArrayHelper, VenueInterface, ResourceInterface, BundleInterface } from "@/utils";
import { Grid, Container, Box } from "@mui/material";

type Props = { program: ProgramInterface; study: StudyInterface; lesson: LessonInterface; venues: VenueInterface[]; resources: ResourceInterface[]; bundles: BundleInterface[]; };

export default function LessonsPage(props: Props) {

  const video = props.lesson.videoEmbedUrl ? (
    <div className="videoWrapper">
      <iframe width="992" height="558" src={props.lesson?.videoEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
    </div>
  ) : (
    <Grid container spacing={3}>
      <Grid item md={2} sm={0} />
      <Grid item md={8} sm={12}>
        <img src={props.lesson.image} className="profilePic" alt={props.lesson.name} /><br /><br />
      </Grid>
    </Grid>
  );

  const title = props.program.name + ": " + props.lesson?.title + " - Lessons.church";
  return (
    <Layout pageTitle={title} metaDescription={props.lesson.description} image={props.lesson.image} >
      <div className="pageSection">
        <Container fixed>
          <Box sx={{textAlign: "center"}}>
            <div className="title">
              {props.program?.name}: <span>{props.study?.name}</span>
            </div>
            <h2 style={{marginTop: 0}}>
              {props.lesson?.name}: <span>{props.lesson?.title}</span>
            </h2>
          </Box>
          {video}
          <p>{props.lesson?.description}</p>
          <Venues venues={props.venues} resources={props.resources} bundles={props.bundles} />
          {props.program.aboutSection && (
            <>
              <h4 style={{ marginTop: 40 }}>About {props.program.name}</h4>
              <ReactMarkdown>{props.program.aboutSection}</ReactMarkdown>
            </>
          )}
        </Container>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
  const programsIds = programs.map((p) => p.id);

  const studies: StudyInterface[] = await ApiHelper.getAnonymous(`/studies/public/programs?ids=${escape(programsIds.join(","))}`, "LessonsApi");
  const studyIds = studies.map((s) => s.id);

  const lessons: LessonInterface[] = await ApiHelper.getAnonymous(`/lessons/public/studies?ids=${escape(studyIds.join(","))}`, "LessonsApi");

  const paths = lessons.map((l) => {
    const study: StudyInterface = ArrayHelper.getOne(studies, "id", l.studyId);
    const program: ProgramInterface = ArrayHelper.getOne(programs, "id", study.programId);
    return { params: { programSlug: program.slug, studySlug: study.slug, lessonSlug: l.slug, }, };
  });

  return { paths, fallback: "blocking", };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program: ProgramInterface = await ApiHelper.getAnonymous("/programs/public/slug/" + params.programSlug, "LessonsApi");
  const study: StudyInterface = await ApiHelper.getAnonymous("/studies/public/slug/" + program.id + "/" + params.studySlug, "LessonsApi");
  const lesson: LessonInterface = await ApiHelper.getAnonymous("/lessons/public/slug/" + study.id + "/" + params.lessonSlug, "LessonsApi");
  const venues: VenueInterface[] = await ApiHelper.getAnonymous("/venues/public/lesson/" + lesson.id, "LessonsApi");
  const resources: ResourceInterface[] = await ApiHelper.getAnonymous("/resources/public/lesson/" + lesson.id, "LessonsApi");
  const bundles: BundleInterface[] = await ApiHelper.getAnonymous("/bundles/public/lesson/" + lesson.id, "LessonsApi");

  resources?.forEach(r => {
    if (r.variants) r.variants = ArrayHelper.getAll(r.variants, "hidden", false);
  });

  return {
    props: { program, study, lesson, venues, resources, bundles },
    revalidate: 30,
  };

};
