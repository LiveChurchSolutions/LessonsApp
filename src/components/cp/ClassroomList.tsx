import { useState, useEffect } from "react";
import Link from "next/link";
import { ClassroomInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, ClassroomEdit } from "../index";
import { SmallButton } from "@/appBase/components";

type Props = {
  classroomSelected: (classroomId: string) => void;
  showFeed: (classroomId: string) => void;
};

export function ClassroomList(props: Props) {
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>(null);
  const [editClassroom, setEditClassroom] = useState<ClassroomInterface>(null);

  const loadData = () => {
    ApiHelper.get("/classrooms", "LessonsApi").then((data: any) => {
      setClassrooms(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    classrooms.forEach((c) => {
      result.push(
        <tr className="classroomRow" key={c.id}>
          <td>
            <i className="fas fa-graduation-cap"></i>{" "}
            <a href="about:blank" onClick={(e) => { e.preventDefault(); props.classroomSelected(c.id); }} >
              {c.name}
            </a>
          </td>
          <td style={{ textAlign: "right" }}>
            <SmallButton icon="rss_feed" text="Subscribe" onClick={() => { props.showFeed(c.id); }} /> &nbsp;
            <SmallButton icon="edit" text="Edit" onClick={() => { setEditClassroom(c); }} />
          </td>
        </tr>
      );
    });
    return result;
  };

  const getTable = () => {
    if (classrooms === null) return <Loading />;
    else
      return (
        <table className="table">
          <tbody>{getRows()}</tbody>
        </table>
      );
  };

  const getEditContent = () => {
    return (<SmallButton icon="add" onClick={() => { setEditClassroom({}) }} />);
  };

  useEffect(loadData, []);

  if (editClassroom) return (<ClassroomEdit classroom={editClassroom} updatedCallback={() => { setEditClassroom(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Classrooms" headerIcon="fas fa-graduation-cap" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </>
    );
}
