import React from "react";
import { VenueInterface, Downloads, Section, ResourceInterface } from ".";
import { Accordion, Row, Col } from "react-bootstrap"
import { useReactToPrint } from "react-to-print";
import { SectionAlt } from "./SectionAlt"

interface Props {
  venue: VenueInterface,
  resources: ResourceInterface[]
}

export const Venue: React.FC<Props> = (props) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue.sections[0].id);

  const handleToggle = (sectionId: string) => {
    setActiveSectionId(sectionId);
  }

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const getSections = () => {
    const sections: JSX.Element[] = [];

    if (window.location.href.indexOf("alt=1") > -1) {
      props.venue.sections?.forEach(s => {
        sections.push(<SectionAlt section={s} resources={props.resources} />);
      });
    } else {
      props.venue.sections?.forEach(s => {
        sections.push(<Section section={s} resources={props.resources} toggleActive={handleToggle} activeSectionId={activeSectionId} />);
      });
    }

    return <Accordion defaultActiveKey={activeSectionId}>{sections}</Accordion>
  }

  return (<>
    <br /><br />
    <Row>
      <Col><h4>{props.venue.name}</h4></Col>
      <Col>
        <Downloads resources={props.resources} />
        <button type="button" className="btn btn-sm btn-light" key={"print" + props.venue.id} onClick={handlePrint} title="print" style={{ float: "right", marginRight: 10 }} ><i className="fas fa-print"></i></button>
      </Col>
    </Row>
    <div ref={contentRef}>
      <h2 className="printOnly">{props.venue.name} Instructions</h2>
      {getSections()}
    </div>
  </>);
}